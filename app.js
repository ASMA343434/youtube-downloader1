const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
// تغيير المنفذ ليتناسب مع Vercel
const port = process.env.PORT || 3000;

// تعديل مسار التخزين ليكون في tmp للتوافق مع Vercel
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = '/tmp/uploads'
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// تكوين المسارات الثابتة
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تعديل مسار القراءة للملفات
app.get('/videos', (req, res) => {
    const dir = '/tmp/uploads'
    if (!fs.existsSync(dir)) {
        return res.json([]);
    }
    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(files.filter(file => ['.mp4', '.avi', '.mkv'].includes(path.extname(file))));
    });
});

// رفع الفيديو
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ filename: req.file.filename });
});

// إنشاء مجلد التحميلات إذا لم يكن موجوداً
if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
