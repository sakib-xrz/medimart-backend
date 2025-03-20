import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import PaymentService from './payment.services';

const CreatePaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const order_id = req.params.order_id;

  const result = await PaymentService.CreatePaymentIntent(order_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully',
    data: {
      paymentURL: result,
    },
  });
});

const VerifyPayment = catchAsync(async (req, res) => {
  const result: unknown = await PaymentService.VerifyPayment(req.body);

  res.redirect(result as string);
});

const PaymentController = { CreatePaymentIntent, VerifyPayment };

export default PaymentController;
