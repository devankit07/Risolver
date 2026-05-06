import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (base64String, folder = 'resolver_incidents') => {
  try {
    if (!base64String) return null;
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
};

export default cloudinary;
