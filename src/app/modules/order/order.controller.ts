import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import OrderService from './order.services';

const CreateProduct = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const file = req.file;
  const orderData = req.body;

  const result = await OrderService.CreateOrder(orderData, file, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const GetMyOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await OrderService.GetMyOrders(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders fetched successfully',
    data: result,
  });
});

const GetMyOrderById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const result = await OrderService.GetMyOrderById(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order fetched successfully',
    data: result,
  });
});

const GetAllOrders = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await OrderService.GetAllOrders(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const UpdateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await OrderService.UpdateOrderStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const OrderController = {
  CreateProduct,
  GetMyOrders,
  GetMyOrderById,
  GetAllOrders,
  UpdateOrderStatus,
};

export default OrderController;
