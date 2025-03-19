const OrderStatus = [
  'PLACED',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const PaymentStatus = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];

const PaymentMethod = ['sslcommerz', 'cash_on_delivery'];

const OrderConstants = {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
};

export default OrderConstants;
