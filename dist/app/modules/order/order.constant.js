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
const ShippingCity = ['INSIDE_DHAKA', 'OUTSIDE_DHAKA'];
const OrderConstants = {
    OrderStatus,
    PaymentStatus,
    ShippingCity,
};
exports.default = OrderConstants;
