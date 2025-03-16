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

const CartUtils = { calculateDiscountedPrice };

export default CartUtils;
