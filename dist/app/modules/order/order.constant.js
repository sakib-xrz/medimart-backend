"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderStatus = [
    'PLACED',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
];
const PaymentStatus = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];
const PaymentMethod = ['sslcommerz', 'cash_on_delivery'];
const OrderConstants = {
    OrderStatus,
    PaymentStatus,
    PaymentMethod,
};
exports.default = OrderConstants;
