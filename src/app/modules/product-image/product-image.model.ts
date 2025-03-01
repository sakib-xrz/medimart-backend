import mongoose from 'mongoose';
import { ProductImageInterface } from './product-image.interface';

const ProductImageSchema = new mongoose.Schema<ProductImageInterface>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

export const ProductImage = mongoose.model<ProductImageInterface>(
  'ProductImage',
  ProductImageSchema,
);
