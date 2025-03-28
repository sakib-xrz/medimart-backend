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

export const DashboardController = {
  getStatsSummary,
};
