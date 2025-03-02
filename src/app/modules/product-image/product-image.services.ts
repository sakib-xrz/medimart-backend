import { ProductImageInterface } from './product-image.interface';
import { ProductImage } from './product-image.model';

const UploadProductImage = async (payload: ProductImageInterface) => {
  const result = await ProductImage.create(payload);
  return result;
};

const ProductImageService = { UploadProductImage };

export default ProductImageService;
