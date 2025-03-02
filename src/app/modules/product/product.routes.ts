import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import ProductValidation from './product.validation';
import ProductController from './product.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth('ADMIN'),
    validateRequest(ProductValidation.CreateProductSchema),
    ProductController.CreateProduct,
  )
  .get(ProductController.GetAllProducts);

router
  .route('/bulk')
  .post(
    auth('ADMIN'),
    validateRequest(ProductValidation.CreateMultipleProductSchema),
    ProductController.CreateMultipleProduct,
  );

router.route('/:id').get(ProductController.GetProductById);

export const ProductRoutes = router;
