/* eslint-disable no-undef */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ProductImageInterface } from './product-image.interface';
import { ProductImage } from './product-image.model';
import { uploadToCloudinary } from '../../utils/handelFile';
import { Product } from '../product/product.model';

import mongoose from 'mongoose';

const UploadProductImage = async (
  payload: ProductImageInterface,
  file: Express.Multer.File,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (payload.type === 'PRIMARY') {
      const primaryImage = await ProductImage.findOne(
        { product_id: payload.product_id, type: 'PRIMARY' },
        null,
        { session },
      );

      if (primaryImage) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Primary image already exists for this product',
        );
      }
    }

    const cloudinaryResponse = await uploadToCloudinary(file, {
      folder: `/medimart/products`,
    });

    const image_url = (cloudinaryResponse as { secure_url: string }).secure_url;
    const public_id = (cloudinaryResponse as { public_id: string }).public_id;

    const productImageData = {
      product_id: payload.product_id,
      image_url,
      public_id,
      type: payload.type,
    };

    const result = await ProductImage.create([productImageData], { session });

    await Product.updateOne(
      { _id: payload.product_id },
      { $push: { images: result[0]._id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const ProductImageService = { UploadProductImage };

export default ProductImageService;
