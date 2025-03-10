const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Global error variables
let lastError = null;
let videos = [];

// Basic error handler
const handleError = (err, req, res) => {
    console.error('Error:', err);
    lastError = err;
    res.status(500).json({
        error: 'حدث خطأ في الخادم',
        details: process.env.NODE_ENV === 'development' ? err.message : null
    });
};

// API Routes with error handling
app.post('/api/upload', async (req, res) => {
    try {
        const { youtubeUrl, title, grade, description } = req.body;
        if (!youtubeUrl || !title || !grade) {
            return res.status(400).json({ error: 'بيانات غير مكتملة' });
        }

        const video = {
            id: Date.now(),
            youtubeUrl,
            title,
            grade,
            description,
            timestamp: new Date()
        };
        
        videos.push(video);
        res.json({ success: true, video });
    } catch (err) {
        handleError(err, req, res);
    }
});

app.get('/api/videos', async (req, res) => {
    try {
        const { grade } = req.query;
        const filteredVideos = grade ? videos.filter(v => v.grade === grade) : videos;
        res.json(filteredVideos);
    } catch (err) {
        handleError(err, req, res);
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'), err => {
        if (err) handleError(err, req, res);
    });
});

app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.js'), err => {
        if (err) handleError(err, req, res);
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        lastError: lastError ? lastError.message : null,
        videosCount: videos.length
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    handleError(err, req, res);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'الصفحة غير موجودة' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
