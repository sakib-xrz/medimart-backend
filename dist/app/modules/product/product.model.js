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
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: product_constant_1.default.Category,
        required: true,
    },
    category_slug: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
    },
    form: {
        type: String,
    },
    pack_size: {
        type: String,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requires_prescription: {
        type: Boolean,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    discount_type: {
        type: String,
        enum: product_constant_1.default.DiscountType,
        default: 'PERCENTAGE',
    },
    stock: {
        type: Number,
        required: true,
    },
    in_stock: {
        type: Boolean,
        required: true,
    },
    expiry_date: {
        type: Date,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.Product = mongoose_1.default.model('Product', ProductSchema);
