import express from 'express';
import auth from '../../middlewares/auth';
import ProductImageController from './product-image.controller';
import { upload } from '../../utils/handelFile';

const router = express.Router();

router
  .route('/')
  .post(
    auth('ADMIN'),
    upload.single('file'),
    ProductImageController.UploadProductImage,
  );

export const ProductImageRoutes = router;
