const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// تأكد من أن الملفات الساكنة يمكن الوصول إليها
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.js'));
});

// Store videos (in real application, use a database)
let videos = [];

app.post('/api/upload', (req, res) => {
    const { youtubeUrl, title, grade, description } = req.body;
    
    // Validate YouTube URL
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Add video to collection
    videos.push({
        id: Date.now(),
        youtubeUrl,
        title,
        grade,
        description,
        timestamp: new Date()
    });

    res.json({ success: true });
});

// Verify code endpoint
app.post('/api/verify-code', (req, res) => {
    const { code, videoId } = req.body;
    
    // Here you should implement your actual code verification logic
    // This is just a simple example
    if (code === '123456') {
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid code' });
    }
});

app.get('/api/videos', (req, res) => {
    const { grade } = req.query;
    const filteredVideos = grade ? videos.filter(v => v.grade === grade) : videos;
    res.json(filteredVideos);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
