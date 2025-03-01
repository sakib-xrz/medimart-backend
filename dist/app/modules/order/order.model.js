"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_constant_1 = __importDefault(require("./order.constant"));
const OrderSchema = new mongoose_1.default.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customer_name: {
        type: String,
        required: true,
    },
    customer_email: {
        type: String,
        required: true,
    },
    customer_phone: {
        type: String,
        required: true,
    },
    shipping_address: {
        type: String,
        required: true,
    },
    shipping_city: {
        type: String,
        enum: order_constant_1.default.ShippingCity,
        default: 'INSIDE_DHAKA',
    },
    order_status: {
        type: String,
        enum: order_constant_1.default.OrderStatus,
        default: 'PLACED',
    },
    payment_status: {
        type: String,
        enum: order_constant_1.default.PaymentStatus,
        default: 'PENDING',
    },
    transaction_id: {
        type: String,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    delivery_charge: {
        type: Number,
        required: true,
    },
    grand_total: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.Order = mongoose_1.default.model('Order', OrderSchema);
