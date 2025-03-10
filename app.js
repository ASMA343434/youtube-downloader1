const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// تخزين الملفات في الذاكرة
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// مصفوفة لتخزين البيانات مؤقتاً
let videos = [];

app.use(express.static('public'));
app.use(express.json());

// تبسيط مسارات API
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/upload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const video = {
            id: Date.now().toString(),
            name: req.file.originalname,
            data: req.file.buffer.toString('base64')
        };

        videos.push(video);
        res.json({ id: video.id });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.get('/api/videos', (req, res) => {
    try {
        const videoList = videos.map(({ id, name }) => ({ id, name }));
        res.json(videoList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list videos' });
    }
});

// إضافة معالج الأخطاء العام
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
