import mongoose from 'mongoose';
import { OrderInterface } from './order.interface';
import OrderConstants from './order.constant';
import ProductConstants from '../product/product.constant';

const OrderSchema = new mongoose.Schema<OrderInterface>(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          dosage: {
            type: String,
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          discount: {
            type: Number,
            default: 0,
            required: true,
          },
          discount_type: {
            type: String,
            enum: ProductConstants.DiscountType,
            default: 'PERCENTAGE',
          },
          requires_prescription: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    payment_method: {
      type: String,
      enum: OrderConstants.PaymentMethod,
      default: 'sslcommerz',
      required: true,
    },
    prescription: {
      type: String,
    },
    order_status: {
      type: String,
      enum: OrderConstants.OrderStatus,
      default: 'PLACED',
    },
    payment_status: {
      type: String,
      enum: OrderConstants.PaymentStatus,
      default: 'PENDING',
    },
    transaction_id: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    delivery_charge: {
      type: Number,
      required: true,
    },
    grand_total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model<OrderInterface>('Order', OrderSchema);
