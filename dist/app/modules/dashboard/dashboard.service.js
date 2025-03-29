"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const order_model_1 = require("../order/order.model");
const user_model_1 = require("../user/user.model");
const product_model_1 = require("../product/product.model");
const getStatsSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Get current date and last month's date
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    // Current month metrics
    const [currentRevenue, currentOrders, currentCustomers, currentProducts] = yield Promise.all([
        // Total revenue (current month)
        order_model_1.Order.aggregate([
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
        order_model_1.Order.countDocuments({
            createdAt: { $gte: lastMonthDate },
        }),
        // Total customers
        user_model_1.User.countDocuments({
            role: 'CUSTOMER',
            is_deleted: false,
            status: 'ACTIVE',
        }),
        // Active products
        product_model_1.Product.countDocuments({
            is_deleted: false,
            in_stock: true,
            stock: { $gt: 0 },
        }),
    ]);
    // Last month metrics for comparison
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const [lastMonthRevenue, lastMonthOrders, lastMonthCustomers, lastMonthProducts,] = yield Promise.all([
        order_model_1.Order.aggregate([
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
        order_model_1.Order.countDocuments({
            createdAt: {
                $gte: twoMonthsAgo,
                $lt: lastMonthDate,
            },
        }),
        user_model_1.User.countDocuments({
            role: 'CUSTOMER',
            createdAt: {
                $gte: twoMonthsAgo,
                $lt: lastMonthDate,
            },
            is_deleted: false,
        }),
        product_model_1.Product.countDocuments({
            createdAt: {
                $gte: twoMonthsAgo,
                $lt: lastMonthDate,
            },
            is_deleted: false,
            in_stock: true,
        }),
    ]);
    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
        if (previous === 0)
            return 100;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    };
    const currentRevenueValue = ((_a = currentRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const lastRevenueValue = ((_b = lastMonthRevenue[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
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
});
const getRevenueSummary = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const revenueData = yield order_model_1.Order.aggregate([
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
    const revenueMap = new Map(revenueData.map((item) => [item._id.month - 1, item.revenue]));
    const currentMonth = new Date().getMonth();
    const allMonthsData = Array.from({ length: 12 }, (_, index) => {
        const monthIndex = (currentMonth + 1 + index) % 12;
        return {
            month: monthsInString[monthIndex],
            revenue: revenueMap.get(monthIndex) || 0,
        };
    }).sort((a, b) => monthsInString.indexOf(a.month) - monthsInString.indexOf(b.month));
    return allMonthsData;
});
const getRecentOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const recentOrders = yield order_model_1.Order.find({})
        .select('order_id order_status grand_total createdAt customer_name')
        .sort({ createdAt: -1 })
        .limit(5);
    return recentOrders;
});
const getLowStockProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const lowStockProducts = yield product_model_1.Product.find({
        in_stock: true,
        stock: { $lte: 20 },
    })
        .select('name slug stock')
        .sort({ stock: 1 })
        .limit(5);
    return lowStockProducts;
});
const getExpiringProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const expiringProducts = yield product_model_1.Product.find({
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
});
exports.DashboardService = {
    getStatsSummary,
    getRevenueSummary,
    getRecentOrders,
    getLowStockProducts,
    getExpiringProducts,
};
