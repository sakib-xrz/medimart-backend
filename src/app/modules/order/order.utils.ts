import { v4 as uuidv4 } from 'uuid';

function generateOrderId() {
  const uuid = uuidv4();
  const alphanumeric = uuid.replace(/[^a-z0-9]/gi, '');
  return alphanumeric.substring(0, 6).toUpperCase();
}

const calculateDiscountedPrice = (
  price: number,
  discount?: number,
  discountType?: 'PERCENTAGE' | 'FLAT',
): number => {
  let finalPrice = price;

  if (discount && discountType) {
    if (discountType === 'PERCENTAGE') {
      finalPrice = price - (price * discount) / 100;
    } else if (discountType === 'FLAT') {
      finalPrice = price - discount;
    }
  }

  return finalPrice < 0 ? 0 : finalPrice;
};

function generateTransactionId() {
  const uuid = uuidv4();
  const alphanumeric = uuid.replace(/[^a-z0-9]/gi, '');
  return `TRX-${alphanumeric.substring(0, 10).toUpperCase()}`;
}

const OrderUtils = {
  generateOrderId,
  calculateDiscountedPrice,
  generateTransactionId,
};

export default OrderUtils;
