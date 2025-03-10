const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// تخزين الملفات في الذاكرة
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// مصفوفة لتخزين البيانات مؤقتاً
const videos = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const videoData = {
            id: Date.now().toString(),
            name: req.file.originalname,
            data: req.file.buffer,
            mimetype: req.file.mimetype
        };

        videos.push(videoData);
        res.json({ 
            success: true,
            id: videoData.id,
            name: videoData.name 
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.get('/videos', (req, res) => {
    try {
        const videoList = videos.map(video => ({
            id: video.id,
            name: video.name
        }));
        res.json(videoList);
    } catch (error) {
        console.error('List videos error:', error);
        res.status(500).json({ error: 'Failed to list videos' });
    }
});

app.get('/video/:id', (req, res) => {
    try {
        const video = videos.find(v => v.id === req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.set('Content-Type', video.mimetype);
        res.send(video.data);
    } catch (error) {
        console.error('Stream error:', error);
        res.status(500).json({ error: 'Streaming failed' });
    }
});

// إضافة معالج الأخطاء العام
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
