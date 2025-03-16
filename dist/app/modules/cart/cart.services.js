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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../product/product.model");
const cart_utils_1 = __importDefault(require("./cart.utils"));
const GetCartProducts = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const getCartProducts = yield Promise.all((_a = payload === null || payload === void 0 ? void 0 : payload.cart_items) === null || _a === void 0 ? void 0 : _a.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.Product.findById(item.id)
            .select('name slug price category dosage form description requires_prescription discount discount_type quantity in_stock expiry_date')
            .lean()
            .exec();
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
        }
        return Object.assign(Object.assign({}, product), { quantity: item.quantity });
    })));
    let subtotal = 0;
    let prescription_required = false;
    getCartProducts.forEach((product) => {
        const finalPrice = cart_utils_1.default.calculateDiscountedPrice(product.price, product.discount, product.discount_type);
        subtotal += finalPrice * product.quantity;
        if (product.requires_prescription) {
            prescription_required = true;
        }
    });
    const shipping_charge = subtotal > 1000 ? 0 : 50;
    const grand_total = subtotal + shipping_charge;
    return {
        products: getCartProducts,
        subtotal,
        shipping_charge,
        grand_total,
        prescription_required,
    };
});
const CartService = { GetCartProducts };
exports.default = CartService;
