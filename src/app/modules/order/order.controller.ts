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

const OrderController = { CreateProduct };

export default OrderController;
