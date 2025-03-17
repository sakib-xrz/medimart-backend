import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';

const GetMyProfile = async (user: JwtPayload) => {
  const result = await User.findOne({
    email: user.email,
    status: 'ACTIVE',
    is_deleted: false,
  }).select('-status -is_deleted -createdAt -updatedAt');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

const GetAllCustomers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: 'CUSTOMER' }), query);

  const users = await queryBuilder
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.select('-password -updatedAt');

  const total = await queryBuilder.getCountQuery();

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: users,
  };
};

const BlockUser = async (targetedUserId: string, user: JwtPayload) => {
  const targetedUser = await User.findById(targetedUserId);

  if (!targetedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (targetedUser._id.toString() === user._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can not block yourself');
  }

  await User.findByIdAndUpdate(targetedUserId, {
    status: targetedUser.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED',
  });
};

const UserService = { GetMyProfile, GetAllCustomers, BlockUser };

export default UserService;
