import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CTAButton from "../common/CTAButton";

const paymentMethods = [
  {
    id: "UPI",
    label: "UPI",
    description: "Pay securely using your UPI app",
  },
  {
    id: "CARD",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Rupay supported",
  },
  {
    id: "WALLET",
    label: "Wallet",
    description: "Use your preferred wallet (PhonePe, Paytm, etc.)",
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    description: "₹20 COD handling fee may apply",
  },
];

export default function CartPaymentOptions({
  onSelectPaymentMethod = (id) => {
    console.log("Payment method selected:", id);
  }, // Callback when a payment method is selected
  onPlaceOrder = (method) => {
    console.log("Placing order with method:", method);
  }, // Callback when Place Order is pressed
  isInitiatingOrder = false, // Flag to indicate if order is being placed
}) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSelect = (id) => {
    setSelectedMethod(id);
    onSelectPaymentMethod?.(id);
  };

  const handlePlaceOrder = () => {
    if (selectedMethod) {
      onPlaceOrder?.(selectedMethod);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 my-4">
      <Text className="text-lg font-lexend-semibold text-text-muted mb-3">
        Payment Method
      </Text>

      {paymentMethods.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            onPress={() => handleSelect(method.id)}
            activeOpacity={0.85}
            className={`flex-row items-start justify-between gap-3 p-4 border rounded-xl mb-3 ${
              isSelected
                ? "border-brand-primary bg-brand-primary/10"
                : "border-background-soft"
            }`}
          >
            <View className="flex-1">
              <Text
                className={`text-base font-lexend-medium ${
                  isSelected ? "text-brand-primary" : "text-text-primary"
                }`}
              >
                {method.label}
              </Text>
              {method.description && (
                <Text className="text-sm font-lexend text-text-muted mt-1">
                  {method.description}
                </Text>
              )}
            </View>

            <MaterialIcons
              name={
                isSelected ? "radio-button-checked" : "radio-button-unchecked"
              }
              size={22}
              color={isSelected ? "#B31F24" : "#9CA3AF"}
            />
          </TouchableOpacity>
        );
      })}

      {selectedMethod && (
        <CTAButton
          label={"Place Order"}
          onPress={handlePlaceOrder}
          loaderText="Placing Order..."
          loading={isInitiatingOrder}
          disabled={isInitiatingOrder}
        />
      )}
    </View>
  );
}
