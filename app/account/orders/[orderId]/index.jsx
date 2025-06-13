import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
import LoadingDots from "@/components/common/LoadingDots";

export default function ViewOrderScreen() {
  const { orderId } = useLocalSearchParams();
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
      <>
        <Text className="text-sm text-gray-700">{address.street}</Text>
        <Text className="text-sm text-gray-700">
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </>
    );
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack title="Order Details" showBackButton />
      <View className="flex-1 py-3 px-4">
        {loading ? (
          <View className="flex-1 items-center justify-center mt-10">
            <LoadingDots title="Fetching order..." subtitle="Please wait" />
          </View>
        ) : !order ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-base">Order not found.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* 🧾 Order Info */}
            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                Order Number
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {order.orderNumber}
              </Text>
              <Text className="text-xs text-gray-400">ID: {order._id}</Text>
            </View>

            {/* 📦 Status */}
            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200 space-y-1">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Order Status
              </Text>
              <Text className="text-sm text-gray-700">
                Status:{" "}
                <Text className="font-semibold capitalize">
                  {order.orderStatus}
                </Text>
              </Text>
              <Text className="text-sm text-gray-700">
                Payment:{" "}
                <Text className="font-semibold capitalize">
                  {order.paymentStatus}
                </Text>
              </Text>
              <Text className="text-sm text-gray-700">
                Method:{" "}
                <Text className="font-semibold capitalize">
                  {order.paymentMethod}
                </Text>
              </Text>
              <Text className="text-sm text-gray-700">
                Date: {dayjs(order.orderDate).format("DD MMM YYYY, hh:mm A")}
              </Text>
            </View>

            {/* 🧪 Items */}
            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Ordered Items
              </Text>
              {order.items?.length > 0 ? (
                order.items.map((item, index) => (
                  <View
                    key={item._id || index}
                    className="flex-row justify-between mb-2"
                  >
                    <View>
                      <Text className="text-sm font-medium text-gray-700">
                        {item.medicineName}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-gray-500">No items found.</Text>
              )}
            </View>

            {/* 💰 Total */}
            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
              <Text className="text-base font-semibold text-gray-800">
                Total Amount
              </Text>
              <Text className="text-xl text-brand-primary font-bold mt-1">
                ₹ {order.totalAmount?.toFixed(2) ?? "0.00"}
              </Text>
            </View>

            {/* 📍 Address */}
            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Delivery Address
              </Text>
              {renderAddress(order.deliveryAddress)}
            </View>

            {/* 🏥 Pharmacy Attempts */}
            {order.pharmacyAttempts?.length > 0 && (
              <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Pharmacy Attempts
                </Text>
                {order.pharmacyAttempts.map((attempt, index) => (
                  <View key={attempt._id || index} className="mb-2">
                    <Text className="text-sm text-gray-700">
                      {index + 1}. Status:{" "}
                      <Text className="font-semibold capitalize">
                        {attempt.status}
                      </Text>
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
