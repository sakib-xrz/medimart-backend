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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const payment_model_1 = require("./payment.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_model_1 = require("../order/order.model");
const updatePaymentAndOrderStatus = (transactionId, paymentStatus, response) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession(); // Start a transaction session
    session.startTransaction();
    try {
        // Update Payment status
        const paymentUpdate = yield payment_model_1.Payment.findOneAndUpdate({ transaction_id: transactionId }, {
            status: paymentStatus,
            payment_gateway_data: response || {},
        }, { new: true, session });
        if (!paymentUpdate) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found');
        }
        const orderUpdate = yield order_model_1.Order.findOneAndUpdate({ transaction_id: transactionId }, {
            payment_status: paymentStatus,
        }, { new: true, session });
        if (!orderUpdate) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        yield session.commitTransaction(); // Commit the transaction
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction(); // Rollback if there's an error
        session.endSession();
        throw error;
    }
});
const PaymentUtils = { updatePaymentAndOrderStatus };
exports.default = PaymentUtils;
