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
exports.DashboardService = {
    getStatsSummary,
};
