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

const GetFeatureProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.GetFeatureProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feature medicines retrieved successfully',
    data: result,
  });
});

const GetAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.GetAllProducts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicines retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const GetProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await ProductService.GetProductBySlug(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine retrieved successfully',
    data: result,
  });
});

const UpdateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productData = req.body;
  const result = await ProductService.UpdateProduct(id, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine updated successfully',
    data: result,
  });
});

const DeleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ProductService.DeleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine deleted successfully',
    data: {},
  });
});

const ProductController = {
  CreateMultipleProduct,
  CreateProduct,
  GetFeatureProducts,
  GetAllProducts,
  GetProductBySlug,
  UpdateProduct,
  DeleteProduct,
};

export default ProductController;
