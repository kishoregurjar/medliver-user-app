import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CTAButton from "../common/CTAButton";

const paymentMethods = [
  {
    id: "UPI",
    label: "UPI",
    description: "Pay securely using your UPI app",
    isAvailable: false,
  },
  {
    id: "CARD",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Rupay supported",
    isAvailable: false,
  },
  {
    id: "WALLET",
    label: "Wallet",
    description: "Use your preferred wallet (PhonePe, Paytm, etc.)",
    isAvailable: false,
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    description: "₹20 COD handling fee may apply",
    isAvailable: true,
  },
];

export default function UserPaymentOptions({
  onSelectPaymentMethod = (id) => {
    if (__DEV__) console.log("Payment method selected:", id);
  },
  onPlaceOrder = (method) => {
    if (__DEV__) console.log("Placing order with method:", method);
  },
  isInitiatingOrder = false,
  type = "pharmacy",
}) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Automatically select the first available payment method on mount
  useEffect(() => {
    const firstAvailableMethod = paymentMethods.find((m) => m.isAvailable);
    if (firstAvailableMethod) {
      setSelectedMethod(firstAvailableMethod.id);
      onSelectPaymentMethod?.(firstAvailableMethod.id);
    }
  }, []);

  const handleSelect = (method) => {
    if (method.isAvailable) {
      setSelectedMethod(method.id);
      onSelectPaymentMethod?.(method.id);
    }
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
            onPress={() => handleSelect(method)}
            activeOpacity={method.isAvailable ? 0.85 : 1}
            className={`flex-row items-start justify-between gap-3 p-4 border rounded-xl mb-3 ${
              isSelected
                ? "border-brand-primary bg-brand-primary/10"
                : "border-background-soft"
            } ${!method.isAvailable && "opacity-50"}`}
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
              {!method.isAvailable && (
                <Text className="text-xs font-lexend text-error mt-1">
                  Currently unavailable
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
          label={`${type === "pharmacy" ? "Place Order" : "Book Test"}`}
          onPress={handlePlaceOrder}
          loaderText={`${
            type === "pharmacy" ? "Placing Order..." : "Booking Test..."
          }`}
          loading={isInitiatingOrder}
          disabled={isInitiatingOrder}
        />
      )}
    </View>
  );
}
