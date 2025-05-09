export const formatPrice = (value, decimals = 2) => {
  const num = Number(value);
  return isNaN(num) ? "₹0.00" : `₹${num.toFixed(decimals)}`;
};

export const formatNumber = (value, decimals = 2) => {
  const num = Number(value);
  return isNaN(num) ? "0" : num.toFixed(decimals);
};

export const getDiscount = (mrp, price) => {
  const discount = Number(mrp) - Number(price);
  return isNaN(discount) || discount < 0 ? 0 : discount;
};
