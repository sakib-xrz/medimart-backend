/* eslint-disable no-undef */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ProductImageInterface } from './product-image.interface';
import { ProductImage } from './product-image.model';
import { uploadToCloudinary } from '../../utils/handelFile';

const UploadProductImage = async (
  payload: ProductImageInterface,
  file: Express.Multer.File,
) => {
  if (payload.type === 'PRIMARY') {
    const primaryImage = await ProductImage.findOne({
      where: {
        product_id: payload.product_id,
        type: 'PRIMARY',
      },
    });

    if (primaryImage) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Primary image already exists for this product',
      );
    }
  }

  const cloudinaryResponse = await uploadToCloudinary(
    file as Express.Multer.File,
    {
      folder: `/medimart/products`,
    },
  );

  const image_url = (cloudinaryResponse as { secure_url: string }).secure_url;
  const public_id = (cloudinaryResponse as { public_id: string }).public_id;

  const productImageData = {
    product_id: payload.product_id,
    image_url,
    public_id,
    type: payload?.type,
  };

  const result = await ProductImage.create(productImageData);
  return result;
};

const ProductImageService = { UploadProductImage };

export default ProductImageService;
