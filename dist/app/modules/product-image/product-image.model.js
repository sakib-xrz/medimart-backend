"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProductImageSchema = new mongoose_1.default.Schema({
    product_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['PRIMARY', 'EXTRA'],
        default: 'EXTRA',
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.ProductImage = mongoose_1.default.model('ProductImage', ProductImageSchema);
