import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { CartRoutes } from '../modules/cart/cart.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';

const router = express.Router();

type Route = {
  path: string;
  route: express.Router;
};

const routes: Route[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/cart',
    route: CartRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
