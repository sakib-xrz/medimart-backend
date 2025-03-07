import mongoose from 'mongoose';
import { ProductInterface } from './product.interface';
import ProductConstants from './product.constant';

const ProductSchema = new mongoose.Schema<ProductInterface>(
  {
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
      enum: ProductConstants.Category,
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
      enum: ProductConstants.DiscountType,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

export const Product = mongoose.model<ProductInterface>(
  'Product',
  ProductSchema,
);
