import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { uploadToCloudinary } from '../../utils/handelFile';
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

  const cloudinaryResponse = await uploadToCloudinary(
    // eslint-disable-next-line no-undef
    file as Express.Multer.File,
    {
      folder: `/medimart/product/${req.body.product_id}`,
      public_id: req.body.product_id,
    },
  );

  const image_url = (cloudinaryResponse as { secure_url: string }).secure_url;

  const payload = {
    product_id: req.body.product_id,
    image_url,
    type: req.body.type,
  };

  const result = await ProductImageService.UploadProductImage(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product image uploaded successfully',
    data: result,
  });
});

const ProductImageController = { UploadProductImage };

export default ProductImageController;
