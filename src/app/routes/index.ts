import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { ProductImageRoutes } from '../modules/product-image/product-image.routes';

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
    path: '/product-images',
    route: ProductImageRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
