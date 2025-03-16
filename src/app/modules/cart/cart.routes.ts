import express from 'express';
import CartController from './cart.controller';

const router = express.Router();

router.get('/', CartController.GetCartProducts);

export const CartRoutes = router;
