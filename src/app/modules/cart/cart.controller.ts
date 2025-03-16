import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import CartService from './cart.services';

const GetCartProducts = catchAsync(async (req: Request, res: Response) => {
  const products = req.body;
  const result = await CartService.GetCartProducts(products);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart products fetched successfully',
    data: result,
  });
});

const CartController = { GetCartProducts };

export default CartController;
