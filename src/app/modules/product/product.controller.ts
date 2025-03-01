import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import ProductService from './product.services';

const CreateMultipleProduct = catchAsync(
  async (req: Request, res: Response) => {
    const productsData = req.body;
    const result = await ProductService.CreateMultipleProduct(productsData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Medicines created successfully',
      data: result,
    });
  },
);

const CreateProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body;
  const result = await ProductService.CreateProduct(productData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Medicine created successfully',
    data: result,
  });
});

const ProductController = { CreateMultipleProduct, CreateProduct };

export default ProductController;
