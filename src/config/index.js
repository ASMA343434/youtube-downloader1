const path = require('path');

const config = {
    port: process.env.PORT || 3000,
    publicDir: path.join(__dirname, '../../public'),
    uploadsDir: path.join(__dirname, '../../public/uploads'),
    uploadLimits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    },
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
};

module.exports = config;
