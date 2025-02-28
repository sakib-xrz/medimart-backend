import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AuthService from './auth.services';
import config from '../../config';

const Login = catchAsync(async (req, res) => {
  const result = await AuthService.Login(req.body);

  const { accessToken, refreshToken } = result;

  res.cookie('REFRESH_TOKEN', refreshToken, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: config.node_env === 'development' ? 'strict' : 'none',
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: {
      token: accessToken,
    },
  });
});

const Register = catchAsync(async (req, res) => {
  const result = await AuthService.Register(req.body);

  const { accessToken, refreshToken } = result;

  res.cookie('REFRESH_TOKEN', refreshToken, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: config.node_env === 'development' ? 'strict' : 'none',
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: {
      token: accessToken,
    },
  });
});

const Logout = catchAsync(async (_req, res) => {
  res.clearCookie('REFRESH_TOKEN');

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Logout successful',
  });
});

const RefreshToken = catchAsync(async (req, res) => {
  const { REFRESH_TOKEN } = req.cookies;

  const result = await AuthService.RefreshToken(REFRESH_TOKEN);

  const { accessToken } = result;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Token refreshed successfully',
    data: {
      token: accessToken,
    },
  });
});

const ChangePassword = catchAsync(async (req, res) => {
  await AuthService.ChangePassword(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
  });
});

const AuthController = {
  Login,
  Register,
  Logout,
  RefreshToken,
  ChangePassword,
};

export default AuthController;
