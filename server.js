const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage
let videos = [];

// API Routes
app.post('/api/upload', (req, res) => {
    try {
        const video = {
            id: Date.now().toString(),
            ...req.body,
            timestamp: new Date()
        };
        videos.push(video);
        res.json({ success: true, video });
    } catch (err) {
        res.status(500).json({ 
            error: 'خطأ في رفع الفيديو',
            message: err.message 
        });
    }
});

app.get('/api/videos', (req, res) => {
    try {
        const { grade } = req.query;
        const filteredVideos = grade ? videos.filter(v => v.grade === grade) : videos;
        res.json(filteredVideos);
    } catch (err) {
        res.status(500).json({ 
            error: 'خطأ في تحميل الفيديوهات',
            message: err.message 
        });
    }
});

// Verify code endpoint with proper error handling
app.post('/api/verify-code', (req, res) => {
    try {
        const { code } = req.body;
        if (code === '123456') {
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'الكود غير صحيح' });
        }
    } catch (err) {
        res.status(500).json({ 
            error: 'خطأ في التحقق من الكود',
            message: err.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        videosCount: videos.length
    });
});

// Serve static files with error handling
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'حدث خطأ في الخادم',
        message: process.env.NODE_ENV === 'development' ? err.message : 'خطأ داخلي'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
