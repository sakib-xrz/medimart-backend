import mongoose from 'mongoose';
import { ProductInterface } from './product.interface';
import ProductConstants from './product.constant';

const ProductSchema = new mongoose.Schema<ProductInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ProductConstants.Category,
      required: true,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductImage',
      },
    ],
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
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model<ProductInterface>(
  'Product',
  ProductSchema,
);
