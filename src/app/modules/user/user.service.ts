import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { Order } from '../order/order.model';

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
  const queryBuilder = new QueryBuilder(
    User.find({ role: 'CUSTOMER', is_deleted: false }),
    query,
  );

  const users = await queryBuilder
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.select('-password -updatedAt -is_deleted');

  const total = await queryBuilder.getCountQuery();

  const orders = await Order.find({
    customer_id: { $in: users.map((customer) => customer._id) },
  });

  const customersWithOrders = users.map((customer) => {
    const customerOrders = orders.filter(
      (order) => order.customer_id.toString() === customer._id.toString(),
    );
    const total_spent = customerOrders.reduce(
      (acc, order) => acc + order.grand_total,
      0,
    );
    const total_orders = customerOrders.length;

    return {
      ...customer.toObject(),
      total_spent,
      total_orders,
    };
  });

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: customersWithOrders,
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
