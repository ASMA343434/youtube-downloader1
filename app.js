const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// إضافة middleware للتعامل مع الأخطاء
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// تكوين multer مع معالجة الأخطاء
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = '/tmp/uploads';
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: function (req, file, cb) {
        try {
            cb(null, Date.now() + path.extname(file.originalname));
        } catch (error) {
            cb(error, null);
        }
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // حد 10 ميجابايت
    }
}).single('video');

// تكوين المسارات الثابتة
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تحسين معالجة قراءة الفيديوهات
app.get('/videos', (req, res) => {
    const dir = '/tmp/uploads';
    try {
        if (!fs.existsSync(dir)) {
            return res.json([]);
        }
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return res.status(500).json({ error: 'Failed to read videos directory' });
            }
            const videos = files.filter(file => 
                ['.mp4', '.avi', '.mkv'].includes(path.extname(file))
            );
            res.json(videos);
        });
    } catch (error) {
        console.error('Error accessing directory:', error);
        res.status(500).json({ error: 'Server error while accessing videos' });
    }
});

// تحسين معالجة تحميل الملفات
app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Server error: ' + err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        res.json({ 
            success: true,
            filename: req.file.filename 
        });
    });
});

// إنشاء مجلد التحميلات إذا لم يكن موجوداً
if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
