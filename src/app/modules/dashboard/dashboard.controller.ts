import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getStatsSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getStatsSummary();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

const getRevenueSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getRevenueSummary();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue summary retrieved successfully',
    data: result,
  });
});

const getRecentOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getRecentOrders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recent orders retrieved successfully',
    data: result,
  });
});

const getLowStockProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getLowStockProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Low stock products retrieved successfully',
    data: result,
  });
});

const getExpiringProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getExpiringProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expiring products retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getStatsSummary,
  getRevenueSummary,
  getRecentOrders,
  getLowStockProducts,
  getExpiringProducts,
};
