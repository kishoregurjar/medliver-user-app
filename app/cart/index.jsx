import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";

const tabs = ["Medicine", "Lab Test"];

const medicineItems = [
  { id: 1, name: "Paracetamol", composition: "Paracetamol 500mg", price: 15.0 },
  { id: 2, name: "Ibuprofen", composition: "Ibuprofen 200mg", price: 20.0 },
  { id: 3, name: "Aspirin", composition: "Aspirin 300mg", price: 12.0 },
];

const labTests = [
  {
    id: 1,
    name: "Blood Test",
    description: "Complete blood count",
    price: 30.0,
  },
  {
    id: 2,
    name: "Urine Test",
    description: "Routine urine analysis",
    price: 25.0,
  },
  { id: 3, name: "X-ray", description: "Chest X-ray", price: 40.0 },
];

export default function CartScreen() {
  const [activeTab, setActiveTab] = useState("Medicine");
  const [promoCode, setPromoCode] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const { colors } = useTheme();

  const calculateTotal = () =>
    medicineItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack
        title="My Cart"
        showBackButton
        clearStack
        backTo="/home"
      />

      {/* Top Tabs */}
      <View className="flex-row bg-white justify-around py-2 mb-2 rounded-xl">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab ? "border-b-2 border-brand-primary" : ""
            }`}
          >
            <Text
              className={`text-sm font-lexend-medium px-3 ${
                activeTab === tab ? "text-brand-primary" : "text-text-muted"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1 px-4 py-4 space-y-6">
        {activeTab === "Medicine" &&
          medicineItems.map((item) => (
            <View
              key={item.id}
              className="bg-white p-4 rounded-xl shadow-md flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-lg font-lexend-semibold text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-sm font-lexend text-text-muted">
                  {item.composition}
                </Text>
                <Text className="text-base font-lexend-medium text-gray-900 mt-2">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity className="bg-brand-primary px-4 py-2 rounded-xl">
                <Text className="text-white font-lexend">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

        {activeTab === "Lab Test" &&
          labTests.map((item) => (
            <View
              key={item.id}
              className="bg-white p-4 rounded-xl shadow-md flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-lg font-lexend-semibold text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-sm font-lexend text-gray-600">
                  {item.description}
                </Text>
                <Text className="text-base font-lexend-medium text-gray-900 mt-2">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity className="bg-brand-primary px-4 py-2 rounded-xl">
                <Text className="text-white font-lexend">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

        {activeTab === "Medicine" && (
          <>
            {/* Promo and Urgency */}
            <TextInput
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Enter Promo Code"
              className="bg-white p-4 rounded-xl font-lexend shadow-md mt-4"
            />
            <TouchableOpacity
              className="flex-row items-center space-x-3 mt-4"
              onPress={() => setUrgentDelivery(!urgentDelivery)}
            >
              <Ionicons
                name={urgentDelivery ? "checkbox-outline" : "square-outline"}
                size={22}
                color={colors.primary}
              />
              <Text className="text-base font-lexend text-gray-800">
                Mark as Urgent Delivery
              </Text>
            </TouchableOpacity>

            {/* Payment Summary */}
            <View className="bg-white p-4 rounded-xl shadow-md mt-4">
              <Text className="text-lg font-lexend-semibold text-gray-900">
                Payment Details
              </Text>
              <Text className="text-sm font-lexend text-gray-600">
                Item Total: ${calculateTotal().toFixed(2)}
              </Text>
              <Text className="text-sm font-lexend text-gray-600">
                Promo Discount: ${promoCode ? "5.00" : "0.00"}
              </Text>
              <Text className="text-sm font-lexend text-gray-600">
                Urgent Delivery: {urgentDelivery ? "$10.00" : "$0.00"}
              </Text>
              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-lg font-lexend-bold text-gray-900">
                  Total
                </Text>
                <Text className="text-xl font-lexend-bold text-gray-900">
                  $
                  {(
                    calculateTotal() +
                    (promoCode ? -5.0 : 0) +
                    (urgentDelivery ? 10.0 : 0)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity className="bg-brand-primary py-3 rounded-xl mt-6">
              <Text className="text-white text-center text-lg font-lexend-semibold">
                Proceed to Payment
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </AppLayout>
  );
}
