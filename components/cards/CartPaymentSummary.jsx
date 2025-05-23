import { View, Text, TouchableOpacity } from "react-native";

const SummaryRow = ({ label, value }) => (
  <View className="flex-row justify-between">
    <Text className="text-sm font-lexend text-gray-600">{label}</Text>
    <Text className="text-sm font-lexend text-gray-600">
      ₹{value >= 0 ? value.toFixed(2) : `-${Math.abs(value).toFixed(2)}`}
    </Text>
  </View>
);

export default function CartPaymentSummary({
  itemTotal,
  promoDiscount,
  deliveryCharge,
  totalAmount,
  onCheckoutPress,
}) {
  return (
    <View className="bg-white border border-background-surface p-4 rounded-xl mt-4">
      <Text className="text-lg font-lexend-semibold text-text-muted">
        Payment Details
      </Text>

      <View className="gap-3 mt-4">
        <SummaryRow label="Item Total" value={itemTotal} />
        <SummaryRow label="Promo Discount" value={-promoDiscount} />
        <SummaryRow label="Urgent Delivery" value={deliveryCharge} />
      </View>

      <View className="border-t border-gray-300 my-4" />
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-lexend text-gray-500">
            Total Amount
          </Text>
          <Text className="text-xl font-lexend-bold text-gray-900 mt-1">
            ₹{totalAmount.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onCheckoutPress}
          className="bg-brand-primary/90 px-6 py-3 rounded-xl"
        >
          <Text className="text-white text-base font-lexend-semibold">
            Proceed to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
