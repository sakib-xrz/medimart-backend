import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';

const getStatsSummary = async () => {
  // Get current date and last month's date
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

  // Current month metrics
  const [currentRevenue, currentOrders, currentCustomers, currentProducts] =
    await Promise.all([
      // Total revenue (current month)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonthDate },
            payment_status: 'PAID',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$grand_total' },
          },
        },
      ]),

      // Total orders (current month)
      Order.countDocuments({
        createdAt: { $gte: lastMonthDate },
      }),

      // Total customers
      User.countDocuments({
        role: 'CUSTOMER',
        is_deleted: false,
        status: 'ACTIVE',
      }),

      // Active products
      Product.countDocuments({
        is_deleted: false,
        in_stock: true,
        stock: { $gt: 0 },
      }),
    ]);

  // Last month metrics for comparison
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const [
    lastMonthRevenue,
    lastMonthOrders,
    lastMonthCustomers,
    lastMonthProducts,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: twoMonthsAgo,
            $lt: lastMonthDate,
          },
          payment_status: 'PAID',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grand_total' },
        },
      },
    ]),

    Order.countDocuments({
      createdAt: {
        $gte: twoMonthsAgo,
        $lt: lastMonthDate,
      },
    }),

    User.countDocuments({
      role: 'CUSTOMER',
      createdAt: {
        $gte: twoMonthsAgo,
        $lt: lastMonthDate,
      },
      is_deleted: false,
    }),

    Product.countDocuments({
      createdAt: {
        $gte: twoMonthsAgo,
        $lt: lastMonthDate,
      },
      is_deleted: false,
      in_stock: true,
    }),
  ]);

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return 100;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const currentRevenueValue = currentRevenue[0]?.total || 0;
  const lastRevenueValue = lastMonthRevenue[0]?.total || 0;

  return {
    total_revenue: currentRevenueValue,
    total_orders: currentOrders,
    total_customers: currentCustomers,
    active_products: currentProducts,
    comparisons: {
      revenue_growth: calculateGrowth(currentRevenueValue, lastRevenueValue),
      orders_growth: calculateGrowth(currentOrders, lastMonthOrders),
      customers_growth: calculateGrowth(currentCustomers, lastMonthCustomers),
      products_growth: calculateGrowth(currentProducts, lastMonthProducts),
    },
  };
};

export const DashboardService = {
  getStatsSummary,
};
