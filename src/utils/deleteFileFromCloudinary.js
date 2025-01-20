import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const deleteFileFromCloudinary = async (fileUrl) => {
  const publicId = fileUrl.split('/').pop().split('.')[0];

  if (publicId) {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  }
};
