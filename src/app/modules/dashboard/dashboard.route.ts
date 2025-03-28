import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/stats-summary',
  auth('ADMIN'),
  DashboardController.getStatsSummary,
);

export const DashboardRoutes = router;
