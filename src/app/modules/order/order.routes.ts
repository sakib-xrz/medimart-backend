import express from 'express';
import auth from '../../middlewares/auth';
import OrderController from './order.controller';
import { upload } from '../../utils/handelFile';

const router = express.Router();

router
  .route('/')
  .post(
    auth('CUSTOMER'),
    upload.single('prescription'),
    OrderController.CreateProduct,
  );

router.route('/my-orders').get(auth('CUSTOMER'), OrderController.GetMyOrders);

export const OrderRoutes = router;
