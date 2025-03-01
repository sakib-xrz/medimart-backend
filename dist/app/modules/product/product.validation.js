"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const product_constant_1 = __importDefault(require("./product.constant"));
const CreateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Product name is required'),
        description: zod_1.z.string().optional(),
        category: zod_1.z.enum([...product_constant_1.default.Category], {
            errorMap: () => ({ message: 'Invalid category' }),
        }),
        price: zod_1.z.number().positive('Price must be a positive number'),
        discount: zod_1.z.number().min(0, 'Discount cannot be negative').default(0),
        discount_type: zod_1.z.enum(['PERCENTAGE', 'FLAT']).default('PERCENTAGE'),
        stock: zod_1.z.number().int().min(0, 'Stock cannot be negative').default(0),
        requires_prescription: zod_1.z.boolean().default(false),
        manufacturer_details: zod_1.z
            .string()
            .min(1, 'Manufacturer details are required'),
        expiry_date: zod_1.z.string().min(1, 'Expiry date is required'),
        is_deleted: zod_1.z.boolean().default(false),
    }),
});
const CreateMultipleProductSchema = zod_1.z.object({
    body: zod_1.z.array(CreateProductSchema.shape.body),
});
const UpdateProductSchema = zod_1.z.object({
    body: CreateProductSchema.shape.body.partial(),
});
const ProductValidation = {
    CreateProductSchema,
    CreateMultipleProductSchema,
    UpdateProductSchema,
};
exports.default = ProductValidation;
