"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_constant_1 = __importDefault(require("./order.constant"));
const product_constant_1 = __importDefault(require("../product/product.constant"));
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
    products: {
        type: [
            {
                product_id: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                dosage: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                discount: {
                    type: Number,
                    default: 0,
                    required: true,
                },
                discount_type: {
                    type: String,
                    enum: product_constant_1.default.DiscountType,
                    default: 'PERCENTAGE',
                },
                requires_prescription: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
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
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    postal_code: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    payment_method: {
        type: String,
        enum: order_constant_1.default.PaymentMethod,
        default: 'sslcommerz',
        required: true,
    },
    prescription: {
        type: String,
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
});
exports.Order = mongoose_1.default.model('Order', OrderSchema);
