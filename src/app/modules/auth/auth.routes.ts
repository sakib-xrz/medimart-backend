import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import AuthValidation from './auth.validation';
import AuthController from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.LoginSchema),
  AuthController.Login,
);

router.post(
  '/register',
  validateRequest(AuthValidation.RegisterSchema),
  AuthController.Register,
);

router.post('/logout', AuthController.Logout);

router.post('/refresh-token', AuthController.RefreshToken);

router.patch(
  '/change-password',
  auth('ADMIN', 'CUSTOMER'),
  validateRequest(AuthValidation.ChangePasswordSchema),
  AuthController.ChangePassword,
);

export const AuthRoutes = router;
