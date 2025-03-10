const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('./src/config');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { uploadToCloudinary, getOptimizedUrl } = require('./src/config/cloudinary');

const app = express(); // Add this line to initialize Express app

// Create uploads directory if it doesn't exist
if (!fs.existsSync(config.uploadsDir)) {
    fs.mkdirSync(config.uploadsDir, { recursive: true });
}

// Configure Cloudinary
cloudinary.config(config.cloudinary);

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'videos',
        resource_type: 'video'
    }
});

const upload = multer({ storage: storage }).single('video');

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

app.get('/video-info', async (req, res) => {
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
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/video-info', async (req, res) => {
    try {
        const url = req.query.url;
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
        
        // Get the best quality format
        const format = formats.reduce((prev, current) => {
            return (prev.qualityLabel > current.qualityLabel) ? prev : current;
        });
        
        if (!format) {
            throw new Error('No suitable video format found');
        }

        res.json({
            title: info.videoDetails.title,
            url: format.url,
            thumbnail: info.videoDetails.thumbnails[0].url,
            type: 'external',
            quality: format.qualityLabel
        });
    } catch (error) {
        console.error('YouTube error:', error);
        res.status(500).json({ 
            error: 'حدث خطأ في تحميل الفيديو. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى.' 
        });
    }
});

app.post('/upload', (req, res) => {
    upload(req, res, function(err) {
        if (err) {
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

app.post('/api/upload', async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const result = await uploadToCloudinary(req.file.path);
            res.json({
                title: req.file.originalname,
                url: getOptimizedUrl(result.public_id),
                type: 'cloudinary'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
