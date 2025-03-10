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
    }
};

module.exports = config;
