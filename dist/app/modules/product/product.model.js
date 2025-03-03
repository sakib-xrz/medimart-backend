"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_constant_1 = __importDefault(require("./product.constant"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: product_constant_1.default.Category,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    discount_type: {
        type: String,
        enum: ['PERCENTAGE', 'FLAT'],
        default: 'PERCENTAGE',
    },
    stock: {
        type: Number,
        default: 0,
    },
    requires_prescription: {
        type: Boolean,
        default: false,
    },
    manufacturer_details: {
        type: String,
        required: true,
    },
    expiry_date: {
        type: String,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model('Product', ProductSchema);
