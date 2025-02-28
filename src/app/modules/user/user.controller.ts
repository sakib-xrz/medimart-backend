import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import UserService from './user.service';

const GetMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await UserService.GetMyProfile(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const GetAllCustomers = catchAsync(async (req, res) => {
  const result = await UserService.GetAllCustomers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customers fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const BlockUser = catchAsync(async (req, res) => {
  const { targatedUserId } = req.params;
  const user = req.user;

  await UserService.BlockUser(targatedUserId, user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
  });
});

const UserController = { GetMyProfile, BlockUser, GetAllCustomers };

export default UserController;
