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

router.route('/admin').get(auth('ADMIN'), OrderController.GetAllOrders);

router.route('/my-orders').get(auth('CUSTOMER'), OrderController.GetMyOrders);

router
  .route('/my-orders/:id')
  .get(auth('CUSTOMER'), OrderController.GetMyOrderById);

export const OrderRoutes = router;
