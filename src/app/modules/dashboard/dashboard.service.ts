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

const getRevenueSummary = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);

  const monthsInString = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const revenueData = await Order.aggregate([
    {
      $match: {
        payment_status: 'PAID',
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$grand_total' },
      },
    },
  ]);

  const revenueMap = new Map(
    revenueData.map((item) => [item._id.month - 1, item.revenue]),
  );

  const currentMonth = new Date().getMonth();
  const allMonthsData = Array.from({ length: 12 }, (_, index) => {
    const monthIndex = (currentMonth + 1 + index) % 12;
    return {
      month: monthsInString[monthIndex],
      revenue: revenueMap.get(monthIndex) || 0,
    };
  }).sort(
    (a, b) => monthsInString.indexOf(a.month) - monthsInString.indexOf(b.month),
  );

  return allMonthsData;
};

const getRecentOrders = async () => {
  const recentOrders = await Order.find({})
    .select('order_id order_status grand_total createdAt customer_name')
    .sort({ createdAt: -1 })
    .limit(5);

  return recentOrders;
};

const getLowStockProducts = async () => {
  const lowStockProducts = await Product.find({
    in_stock: true,
    stock: { $lte: 20 },
  })
    .select('name slug stock')
    .sort({ stock: 1 })
    .limit(5);

  return lowStockProducts;
};

const getExpiringProducts = async () => {
  const expiringProducts = await Product.find({
    $or: [
      { expiry_date: { $lte: new Date() } },
      {
        expiry_date: {
          $lte: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
      },
    ],
  })
    .select('name slug expiry_date')
    .sort({ expiry_date: 1 })
    .limit(5);

  return expiringProducts;
};

export const DashboardService = {
  getStatsSummary,
  getRevenueSummary,
  getRecentOrders,
  getLowStockProducts,
  getExpiringProducts,
};
