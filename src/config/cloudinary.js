const { v2: cloudinary } = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'de6swm7bg', 
    api_key: '514845977585693', 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'video',
            folder: 'videos',
            ...options
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

const getOptimizedUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        ...options
    });
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    getOptimizedUrl
};
