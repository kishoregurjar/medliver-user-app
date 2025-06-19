import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";
import LoadingDots from "@/components/common/LoadingDots";
import { useCart } from "@/contexts/CartContext"; // if you have it
import CTAButton from "@/components/common/CTAButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Section({ title, children }) {
  return (
    <View className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
      <Text className="text-base font-lexend-semibold text-gray-800 mb-2">
        {title}
      </Text>
      {children}
    </View>
  );
}

function KeyValueRow({ label, value }) {
  return (
    <View className="flex-row justify-between mb-1">
      <Text className="text-sm font-lexend text-gray-500">{label}</Text>
      <Text className="text-sm font-lexend-medium text-gray-800">{value}</Text>
    </View>
  );
}

export default function ViewOrderScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { request: fetchOrderById } = useAxios();
  const { addToCart } = useCart?.() ?? {};

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      fetchOrderById({
        url: `/user/get-order-by-id?orderId=${orderId}`,
        method: "GET",
        authRequired: true,
      }).then(({ data, error }) => {
        console.log(data.data.order);

        if (!error) setOrder(data?.data?.order ?? null);
        setLoading(false);
      });
    }
  }, [orderId]);

  const renderAddress = (address) =>
    address && (
      <>
        <Text className="text-sm font-lexend text-gray-700">
          {address.street}
        </Text>
        <Text className="text-sm font-lexend text-gray-700">
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </>
    );

  const handleTrackOrder = () => {
    router.push(`/account/orders/${orderId}/track-order`);
  };

  const handleReorder = () => {
    Alert.alert("Reorder", "Reorder feature coming soon!");
  };

  const handleRepeatOrder = () => {
    if (!order?.items?.length) return;
    order.items.forEach((item) => {
      addToCart?.({
        productId: item.medicineId,
        quantity: item.quantity,
      });
    });
    Alert.alert("Items added", "Items have been added to your cart.");
  };

  const ORDER_STATUS_STEPS = [
    { key: "order_received", label: "Order Received" },
    { key: "order_accepted", label: "Order Accepted" },
    { key: "assigned_to_delivery_partner", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" }, // Optional
  ];

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack title="Order Details" showBackButton />
      <View className="bg-white rounded-xl flex-1 p-4">
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <LoadingDots title="Fetching order..." subtitle="Please wait" />
          </View>
        ) : !order ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-base font-lexend text-gray-500">
              Order not found.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <Section title="Order Summary">
                <KeyValueRow label="Order Number" value={order.orderNumber} />
                <KeyValueRow
                  label="Order Date"
                  value={dayjs(order.orderDate).format("DD MMM YYYY, hh:mm A")}
                />
              </Section>

              <Section title="Order Status">
                <View className="pl-2 border-l-2 border-brand-primary">
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const isCompleted =
                      ORDER_STATUS_STEPS.findIndex(
                        (s) => s.key === order.orderStatus
                      ) > index;
                    const isActive = order.orderStatus === step.key;

                    return (
                      <View
                        key={step.key}
                        className="flex-row items-start mb-4 ml-2"
                      >
                        <View
                          className={`w-3 h-3 rounded-full mt-1 ${
                            isCompleted || isActive
                              ? "bg-brand-primary"
                              : "bg-gray-300"
                          }`}
                        />
                        <View className="ml-3">
                          <Text
                            className={`text-sm font-lexend-medium ${
                              isCompleted || isActive
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </Text>
                          {isActive && (
                            <Text className="text-xs text-brand-primary font-lexend mt-0.5">
                              In Progress
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
                {order.orderStatus === "assigned_to_delivery_partner" && (
                  <CTAButton
                    label={"Track Order"}
                    onPress={handleTrackOrder}
                    icon={
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={16}
                        color={"white"}
                      />
                    }
                    className="my-4"
                    size="sm"
                  />
                )}
              </Section>

              <Section title="Ordered Items">
                {order.items?.length > 0 ? (
                  order.items.map((item, index) => (
                    <View
                      key={item._id || index}
                      className="flex-row items-center mb-3"
                    >
                      <Image
                        source={{
                          uri:
                            item.thumbnailUrl ||
                            "https://via.placeholder.com/48x48.png?text=Item",
                        }}
                        className="w-12 h-12 rounded-md bg-gray-100 mr-3"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-sm font-lexend-semibold text-gray-800">
                          {item.medicineName}
                        </Text>
                        <Text className="text-xs font-lexend text-gray-500">
                          Qty: {item.quantity}
                        </Text>
                      </View>
                      <Text className="text-sm font-lexend text-gray-800">
                        ₹ {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm font-lexend text-gray-500">
                    No items found.
                  </Text>
                )}
              </Section>

              <Section title="Payment Details">
                <KeyValueRow
                  label="Payment Status"
                  value={order.paymentStatus}
                />
                <KeyValueRow
                  label="Payment Method"
                  value={order.paymentMethod}
                />
              </Section>

              <Section title="Total Amount">
                <Text className="text-xl font-lexend-bold text-brand-primary">
                  ₹ {order.totalAmount?.toFixed(2) ?? "0.00"}
                </Text>
              </Section>

              <Section title="Delivery Address">
                {renderAddress(order.deliveryAddress)}
              </Section>
            </ScrollView>
          </>
        )}
      </View>
    </AppLayout>
  );
}
