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
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("../product/product.model");
const handelFile_1 = require("../../utils/handelFile");
const order_utils_1 = __importDefault(require("./order.utils"));
const order_model_1 = require("./order.model");
const payment_model_1 = require("../payment/payment.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const order_constant_1 = __importDefault(require("./order.constant"));
const CreateOrder = (payload, file, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { products, customer_name, customer_email, customer_phone, address, city, postal_code, notes, payment_method, } = payload;
        // Parse order items from the products JSON string.
        const orderItems = JSON.parse(products);
        // Find and validate the user within the transaction session.
        const requestedUser = yield user_model_1.User.findOne({
            email: user.email,
            status: 'ACTIVE',
            is_deleted: false,
        }).session(session);
        if (!requestedUser) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found');
        }
        // Get product IDs from order items.
        const productIds = orderItems.map((item) => item.product_id);
        // Retrieve the products in session.
        const requestedProducts = yield product_model_1.Product.find({
            _id: { $in: productIds },
            is_deleted: false,
        }).session(session);
        if (requestedProducts.length !== productIds.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Product not found');
        }
        // Generate order ID up front so it can be reused.
        const order_id = order_utils_1.default.generateOrderId();
        // Check if any product requires a prescription.
        const isPrescriptionRequired = requestedProducts.some((product) => product.requires_prescription);
        let prescription;
        if (isPrescriptionRequired) {
            if (!file) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Prescription required');
            }
            const { secure_url } = (yield (0, handelFile_1.uploadToCloudinary)(file, {
                public_id: order_id,
                folder: 'medimart/prescriptions',
            }));
            prescription = secure_url;
        }
        let subtotal = 0;
        // Prepare order products and the corresponding stock updates in one loop.
        const stockUpdates = [];
        const orderProducts = requestedProducts.map((product) => {
            const orderItem = orderItems.find((item) => item.product_id === product._id.toString());
            if (!orderItem || product.stock < orderItem.quantity) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Product out of stock');
            }
            const finalPrice = order_utils_1.default.calculateDiscountedPrice(product.price, product.discount, product.discount_type);
            subtotal += finalPrice * orderItem.quantity;
            stockUpdates.push({
                productId: product._id.toString(),
                newStock: product.stock - orderItem.quantity,
            });
            return {
                product_id: product._id,
                name: product.name,
                price: product.price,
                dosage: product.dosage,
                discount: product.discount,
                discount_type: product.discount_type,
                quantity: orderItem.quantity,
                requires_prescription: product.requires_prescription,
            };
        });
        // Compute delivery charge and grand total.
        const delivery_charge = subtotal > 1000 ? 0 : 50;
        const grand_total = subtotal + delivery_charge;
        const transaction_id = order_utils_1.default.generateTransactionId();
        // Create the order within the session.
        const orderDocs = yield order_model_1.Order.create([
            {
                order_id,
                customer_id: requestedUser._id,
                products: orderProducts,
                customer_name,
                customer_email,
                customer_phone,
                address,
                city,
                postal_code,
                notes,
                payment_method,
                prescription,
                subtotal,
                delivery_charge,
                grand_total,
                transaction_id,
            },
        ], { session });
        const order = orderDocs[0];
        // Update product stock concurrently using the session.
        yield Promise.all(stockUpdates.map(({ productId, newStock }) => product_model_1.Product.updateOne({ _id: productId }, {
            stock: newStock,
            in_stock: newStock > 0,
        }, { session })));
        // Create the payment record within the session.
        yield payment_model_1.Payment.create([
            {
                order_id: order._id,
                amount: grand_total,
                transaction_id,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const GetMyOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({
        customer_id: user._id,
    }).sort({ createdAt: -1 });
    return orders;
});
const GetMyOrderById = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findOne({
        order_id: id,
        customer_id: user._id,
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    return order;
});
const GetAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(order_model_1.Order.find(), query);
    const ordersQuery = queryBuilder
        .search(['order_id', 'customer_name', 'customer_email', 'customer_phone'])
        .filter()
        .sort()
        .fields()
        .paginate();
    const total = yield queryBuilder.getCountQuery();
    const orders = yield ordersQuery.modelQuery;
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: orders,
    };
});
const UpdateOrderStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const order = yield order_model_1.Order.findById(id).session(session);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        if (!order_constant_1.default.OrderStatus.includes(status)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid order status');
        }
        const currentStatus = order.order_status;
        const invalidTransitions = {
            PLACED: [],
            CONFIRMED: [],
            SHIPPED: ['PLACED', 'CONFIRMED'],
            DELIVERED: ['PLACED', 'CONFIRMED', 'SHIPPED', 'CANCELLED'],
            CANCELLED: ['DELIVERED', 'SHIPPED'],
        };
        if ((_a = invalidTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(status)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid status change "${currentStatus}" → "${status}"`);
        }
        switch (status) {
            case 'CONFIRMED':
                if (Array.isArray(order.products) &&
                    order.products.some((product) => product.requires_prescription) &&
                    !order.prescription) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot confirm order without prescription');
                }
                break;
            case 'SHIPPED':
                if (order.payment_method !== 'cash_on_delivery' &&
                    order.payment_status !== 'PAID') {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot ship an order with incomplete payment');
                }
                break;
            case 'DELIVERED':
                if (order.payment_method === 'cash_on_delivery') {
                    order.payment_status = 'PAID';
                }
                break;
            case 'CANCELLED':
                if (order.payment_status === 'PAID') {
                    order.payment_status = 'CANCELLED';
                    yield payment_model_1.Payment.updateOne({ order_id: order._id }, { payment_status: 'CANCELLED', payment_gateway_data: null }, { session });
                    yield Promise.all(Array.isArray(order.products)
                        ? order.products.map((product) => product_model_1.Product.updateOne({ _id: product.product_id }, { $inc: { stock: product.quantity } }, { session }))
                        : []);
                }
                break;
        }
        order.order_status = status;
        const updatedOrder = yield order.save({ session });
        yield session.commitTransaction();
        return updatedOrder;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const OrderService = {
    CreateOrder,
    GetMyOrders,
    GetMyOrderById,
    GetAllOrders,
    UpdateOrderStatus,
};
exports.default = OrderService;
