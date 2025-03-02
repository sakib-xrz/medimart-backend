/* eslint-disable no-undef */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import ProductImageService from './product-image.services';

const UploadProductImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Please provide an image file',
    });
  }

  if (!req.body.product_id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Please provide a product id',
    });
  }

  const result = await ProductImageService.UploadProductImage(
    req.body,
    file as Express.Multer.File,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product image uploaded successfully',
    data: result,
  });
});

const ProductImageController = { UploadProductImage };

export default ProductImageController;
