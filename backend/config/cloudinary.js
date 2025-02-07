const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// ✅ Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use Cloudinary as storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",  // Change this to whatever folder you want in Cloudinary
        resource_type: "auto",  // Automatically detect if it's an image or video
        allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov", "avi"],
    },
});

// ✅ Use Multer with Cloudinary storage
const multerMiddleware = multer({ storage: storage });

// ✅ Function to upload file to Cloudinary (if needed separately)
const uploadFileToCloudinary = async (file) => {
    return await cloudinary.uploader.upload(file.path, {
        resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    });
};

// ✅ Function to delete file from Cloudinary
const deleteFileFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
};

// ✅ Export the functions & middleware
module.exports = { multerMiddleware, uploadFileToCloudinary, deleteFileFromCloudinary };
