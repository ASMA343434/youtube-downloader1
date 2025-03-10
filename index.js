const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
