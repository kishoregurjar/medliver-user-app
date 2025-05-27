import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useLocalSearchParams } from "expo-router"; // get orderId from params
import dayjs from "dayjs";

export default function ViewOrderScreen() {
  const { orderId } = useLocalSearchParams(); // e.g., 680f521aa3ecef414a602f22
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { request: fetchOrderById } = useAxios();

  const getOrder = async () => {
    setLoading(true);
    const { data, error } = await fetchOrderById({
      url: `/user/get-order-by-id?orderId=${orderId}`,
      method: "GET",
      authRequired: true,
    });

    if (!error) {
      setOrder(data?.data?.order ?? null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (orderId) getOrder();
  }, [orderId]);

  const renderAddress = (address) => {
    if (!address) return null;
    return (
      <View className="mb-4">
        <Text className="text-sm text-gray-600">{address.street}</Text>
        <Text className="text-sm text-gray-600">
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </View>
    );
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Order Details" />
      <View className="flex-1 px-4 py-2">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-500 mt-2">Fetching order...</Text>
          </View>
        ) : !order ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-base">Order not found.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="space-y-4 pb-12"
          >
            {/* Order ID */}
            <View className="bg-white p-4 rounded-xl border border-background-soft">
              <Text className="text-lg font-semibold text-brand-primary mb-1">
                Order ID
              </Text>
              <Text className="text-sm text-gray-700">{order._id}</Text>
            </View>

            {/* Statuses */}
            <View className="bg-white p-4 rounded-xl border border-background-soft space-y-2">
              <Text className="text-lg font-semibold text-gray-800">
                Order Status
              </Text>
              <Text className="text-sm text-gray-700">
                Status: {order.orderStatus}
              </Text>
              <Text className="text-sm text-gray-700">
                Payment: {order.paymentStatus}
              </Text>
              <Text className="text-sm text-gray-700">
                Method: {order.paymentMethod}
              </Text>
              <Text className="text-sm text-gray-700">
                Date: {dayjs(order.orderDate).format("DD MMM YYYY, hh:mm A")}
              </Text>
            </View>

            {/* Delivery Address */}
            <View className="bg-white p-4 rounded-xl border border-background-soft">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Delivery Address
              </Text>
              {renderAddress(order.deliveryAddress)}
            </View>

            {/* Total */}
            <View className="bg-white p-4 rounded-xl border border-background-soft">
              <Text className="text-lg font-semibold text-gray-800">
                Total Amount
              </Text>
              <Text className="text-xl text-brand-primary font-bold mt-1">
                ₹ {order.totalAmount?.toFixed(2)}
              </Text>
            </View>

            {/* Pharmacy Attempts (optional) */}
            {order.pharmacyAttempts?.length > 0 && (
              <View className="bg-white p-4 rounded-xl border border-background-soft">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Pharmacy Attempts
                </Text>
                {order.pharmacyAttempts.map((attempt, index) => (
                  <View key={attempt._id || index} className="mb-2">
                    <Text className="text-sm text-gray-700">
                      {index + 1}. Status: {attempt.status}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      At:{" "}
                      {dayjs(attempt.attemptedAt).format(
                        "DD MMM YYYY, hh:mm A"
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </AppLayout>
  );
}
