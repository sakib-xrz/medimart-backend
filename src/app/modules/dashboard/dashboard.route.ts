import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/stats-summary',
  auth('ADMIN'),
  DashboardController.getStatsSummary,
);

router.get(
  '/revenue-summary',
  auth('ADMIN'),
  DashboardController.getRevenueSummary,
);

router.get(
  '/recent-orders',
  auth('ADMIN'),
  DashboardController.getRecentOrders,
);

router.get(
  '/low-stock-products',
  auth('ADMIN'),
  DashboardController.getLowStockProducts,
);

router.get(
  '/expiring-products',
  auth('ADMIN'),
  DashboardController.getExpiringProducts,
);

export const DashboardRoutes = router;
