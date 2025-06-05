import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { format } from "date-fns";
import useAxios from "@/hooks/useAxios";
import SkeletonTestOrderDetails from "@/components/skeletons/SkeletonTestOrderDetails";

export default function TestOrderDetailsScreen() {
  const { testOrderId } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { request: getTestOrderDetails, loading: isLoading } = useAxios();

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

  useEffect(() => {
    if (testOrderId) {
      fetchOrderDetails();
    }
  }, [testOrderId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrderDetails().finally(() => setRefreshing(false));
  }, []);

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

      <ScrollView
        className="p-4 space-y-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Loading State */}
        {isLoading && <SkeletonTestOrderDetails />}

        {/* No Data State */}
        {!isLoading && !orderDetails && (
          <View className="flex-1 items-center justify-center my-10">
            <Text className="text-base font-lexend text-text-muted text-center">
              No order details found.
            </Text>
          </View>
        )}

        {/* Main Content */}
        {!isLoading && orderDetails && (
          <View className="flex-1 gap-3">
            {/* Patient Info */}
            <Card title="Patient Info">
              <TextRow label="Name" value={customer?.fullName} />
              <TextRow label="Email" value={customer?.email} />
              <TextRow label="Phone" value={customer?.phoneNumber} />
            </Card>

            {/* Selected Tests */}
            <Card title="Selected Tests">
              {selectedTests.length ? (
                selectedTests.map((test, index) => (
                  <View
                    key={test._id}
                    className="flex-row justify-between py-2 border-b border-gray-300"
                  >
                    <Text className="text-sm font-lexend-medium text-text-primary">
                      # {index + 1}
                    </Text>
                    <Text className="text-sm text-text-primary">
                      {test.name}
                    </Text>
                    <Text className="text-sm font-lexend-medium text-text-primary">
                      ₹{test.price}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm font-lexend text-text-muted">
                  No tests selected
                </Text>
              )}
              {selectedTests.length > 0 && (
                <View className="flex-row justify-between py-2">
                  <Text className="text-sm font-lexend text-text-primary">
                    Total
                  </Text>
                  <Text className="text-sm font-lexend-medium text-text-primary">
                    ₹
                    {selectedTests.reduce(
                      (acc, test) => acc + (test.price || 0),
                      0
                    )}
                  </Text>
                </View>
              )}
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
              <DetailRow
                label="Payment Method"
                value={paymentMethod || "N/A"}
              />
              <DetailRow
                label="Payment Status"
                value={paymentStatus || "N/A"}
              />
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
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
}

// Reusable Components
function Card({ title, children }) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100 flex-1 gap-2">
      <Text className="text-lg font-lexend-semibold text-black mb-2">
        {title}
      </Text>
      {children}
    </View>
  );
}

function TextRow({ label, value }) {
  return (
    <Text className="text-sm font-lexend text-text-muted">
      {label}: {value || "N/A"}
    </Text>
  );
}

function DetailRow({ label, value, valueStyle = "text-gray-800" }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm font-lexend text-gray-600">{label}</Text>
      <Text className={`text-sm font-lexend-medium ${valueStyle}`}>
        {value}
      </Text>
    </View>
  );
}
