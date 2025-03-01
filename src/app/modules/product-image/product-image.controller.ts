import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
// import ProductImageService from './product-image.services';

const UploadProductImage = catchAsync(async (req: Request, res: Response) => {
  const productImageData = req.body;

  console.dir(productImageData, { productImageData });

  //   const result = await ProductImageService.UploadProductImage(productImageData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product image uploaded successfully',
    // data: result,
  });
});

const ProductImageController = { UploadProductImage };

export default ProductImageController;
