import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { format } from "date-fns";
import useAxios from "@/hooks/useAxios";

export default function TestOrderDetailsScreen() {
  const { testOrderId } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const { request: getTestOrderDetails, loading: isLoading } = useAxios();

  useEffect(() => {
    if (!testOrderId) return;

    const fetchOrderDetails = async () => {
      const { data, error } = await getTestOrderDetails({
        url: `/user/get-order-details-pathology`,
        method: "GET",
        authRequired: true,
        params: { orderId: testOrderId },
      });

      if (!error && data?.status === 200) {
        setOrderDetails(data.data);
      } else {
        console.error("Failed to fetch order details:", error);
        setOrderDetails(null);
      }
    };

    fetchOrderDetails();
  }, [testOrderId]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes("delivered")) return "text-green-600";
    if (s?.includes("cancelled")) return "text-red-500";
    return "text-yellow-600";
  };

  const {
    customer,
    selectedTests = [],
    isHomeCollection,
    orderStatus,
    reportStatus,
    paymentStatus,
    paymentMethod,
    orderDate,
  } = orderDetails || {};

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Test Order Details" />
      <ScrollView className="">
        {/* Patient Info */}
        <Card title="Patient Info">
          <TextRow label="Name" value={customer?.fullName} />
          <TextRow label="Email" value={customer?.email} />
          <TextRow label="Phone" value={customer?.phoneNumber} />
        </Card>

        {/* Selected Tests */}
        <Card title="Selected Tests">
          <View>
            {selectedTests.length ? (
              selectedTests.map((test, index) => (
                <View
                  key={test._id}
                  className="flex-row justify-between py-2 border-b border-gray-300"
                >
                    <Text className="text-sm font-medium text-gray-800"># {index + 1}</Text>
                  <Text className="text-sm text-gray-800">{test.name}</Text>
                  <Text className="text-sm font-medium text-black">
                    ₹{test.price}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-500">No tests selected</Text>
            )}
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-800">Total</Text>
              <Text className="text-sm font-medium text-black">
                ₹{selectedTests.reduce((acc, test) => acc + test.price, 0)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Order Summary */}
        <Card title="Order Summary">
          <DetailRow
            label="Order Date"
            value={
              orderDate
                ? format(new Date(orderDate), "dd MMM yyyy, hh:mm a")
                : "N/A"
            }
          />
          <DetailRow
            label="Collection"
            value={isHomeCollection ? "Home Collection" : "Lab Visit"}
          />
          <DetailRow label="Payment Method" value={paymentMethod || "N/A"} />
          <DetailRow label="Payment Status" value={paymentStatus || "N/A"} />
          <DetailRow
            label="Report Status"
            value={reportStatus?.replaceAll("_", " ") || "N/A"}
          />
          <DetailRow
            label="Order Status"
            value={orderStatus?.replaceAll("_", " ") || "N/A"}
            valueStyle={getStatusColor(orderStatus)}
          />
        </Card>
      </ScrollView>
    </AppLayout>
  );
}

// Reusable UI Components
function Card({ title, children }) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <Text className="text-lg font-semibold text-black mb-2">{title}</Text>
      {children}
    </View>
  );
}

function TextRow({ label, value }) {
  return (
    <Text className="text-sm text-gray-700">
      {label}: {value || "N/A"}
    </Text>
  );
}

function DetailRow({ label, value, valueStyle = "text-gray-800" }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-gray-600">{label}</Text>
      <Text className={`text-sm font-medium ${valueStyle}`}>{value}</Text>
    </View>
  );
}
