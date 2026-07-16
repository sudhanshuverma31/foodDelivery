import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer: Buffer, folder = 'fooddelivery') => {
  return new Promise<any>((resolve, reject) => {
    console.log('storing');
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      console.log('cloudinary callback', { error, result });
      if (error) {
        console.log('Cloudinary upload error', error);
        reject(error);
        return;
      }

      if (!result) {
        console.log('Cloudinary upload returned no result');
        reject(new Error('Cloudinary upload failed: no result'));
        return;
      }

      resolve(result);
      console.log('stored');
    });

    stream.end(fileBuffer);
  });
};

export default cloudinary;
