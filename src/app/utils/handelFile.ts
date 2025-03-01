import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import config from '../config/index';
import { Request } from 'express';

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  // eslint-disable-next-line no-undef
  params: async (_req: Request, file: Express.Multer.File) => ({
    folder: 'uploads', // Change folder name if needed
    format: file.mimetype.split('/')[1],
    public_id: `${Date.now()}-${file.originalname}`,
    resource_type: 'auto',
  }),
});

const upload = multer({ storage, limits: { fileSize: 30 * 1024 * 1024 } }); // 30MB limit

// Function for deleting files from Cloudinary
const deleteFromCloudinary = async (
  publicIds: string | string[],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
    cloudinary.api.delete_resources(ids, (error, result) => {
      if (error) {
        return reject(
          new Error(`Failed to delete from Cloudinary: ${error.message}`),
        );
      }
      resolve(result);
    });
  });
};

export { upload, deleteFromCloudinary };
