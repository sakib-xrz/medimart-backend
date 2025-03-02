import mongoose from 'mongoose';
import { OrderItemInterface } from './order-item.interface';

const OrderItemSchema = new mongoose.Schema<OrderItemInterface>(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
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
  },
  {
    timestamps: true,
  },
);

export const OrderItem = mongoose.model<OrderItemInterface>(
  'OrderItem',
  OrderItemSchema,
);
