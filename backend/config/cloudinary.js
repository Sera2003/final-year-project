import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'placeholder_cloud_name',
        api_key: process.env.CLOUDINARY_API_KEY || 'placeholder_api_key',
        api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder_api_secret',
    });
};

export default connectCloudinary;
