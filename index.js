const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('./src/config');

const app = express(); // Add this line to initialize Express app

// Create uploads directory if it doesn't exist
if (!fs.existsSync(config.uploadsDir)) {
    fs.mkdirSync(config.uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: config.uploadsDir,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: config.uploadLimits
}).single('video');

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.static(config.publicDir));
app.use('/uploads', express.static(config.uploadsDir));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(config.publicDir, 'index.html'));
});

app.get('/up.html', (req, res) => {
    res.sendFile(path.join(config.publicDir, 'up.html'));
});

// Update API routes
app.get('/api/video-info', async (req, res) => {
    try {
        const url = req.query.url;
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest',
            filter: 'videoandaudio'
        });
        
        res.json({
            title: info.videoDetails.title,
            url: format.url,
            thumbnail: info.videoDetails.thumbnails[0].url
        });
    } catch (error) {
        console.error('Video info error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/upload', (req, res) => {
    upload(req, res, function(err) {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ 
                error: err.message 
            });
        }
        
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No file uploaded' 
            });
        }

        res.json({
            title: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            type: 'local'
        });
    });
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
