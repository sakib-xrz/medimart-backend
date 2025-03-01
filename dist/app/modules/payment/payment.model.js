"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const payment_constant_1 = __importDefault(require("./payment.constant"));
const PaymentSchema = new mongoose_1.default.Schema({
    order_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    transaction_id: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: payment_constant_1.default.Status,
        default: 'PENDING',
    },
    payment_gateway_data: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.Payment = mongoose_1.default.model('Payment', PaymentSchema);
