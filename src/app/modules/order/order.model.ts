import mongoose from 'mongoose';
import { OrderInterface } from './order.interface';
import OrderConstants from './order.constant';

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
    shipping_address: {
      type: String,
      required: true,
    },
    shipping_city: {
      type: String,
      enum: OrderConstants.ShippingCity,
      default: 'INSIDE_DHAKA',
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
