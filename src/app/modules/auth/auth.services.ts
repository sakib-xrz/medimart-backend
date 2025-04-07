import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { LoginType, RegisterType } from './auth.interface';
import AuthUtils from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const Login = async (payload: LoginType) => {
  const user = await User.isUserExists(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email');
  }

  const is_blocked = user?.status === 'BLOCKED';

  if (is_blocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  const is_deleted = user?.is_deleted;

  if (is_deleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken };
};

const Register = async (payload: RegisterType) => {
  const isUserExists = await User.isUserExists(payload.email);

  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const user = await User.create({ ...payload });

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken };
};

const ChangePassword = async (
  payload: {
    oldPassword: string;
    newPassword: string;
  },
  user: JwtPayload,
) => {
  const isUserValid = await User.findOne({
    _id: user.id,
    is_deleted: false,
  }).select('+password');

  if (!isUserValid) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    isUserValid.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  isUserValid.password = payload.newPassword;
  await isUserValid.save();
};

const AuthService = { Login, Register, ChangePassword };

export default AuthService;
