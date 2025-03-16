import express from 'express';
import CartController from './cart.controller';

const router = express.Router();

router.post('/', CartController.GetCartProducts);

export const CartRoutes = router;
