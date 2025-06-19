import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import SkeletonTestOrderDetails from "@/components/skeletons/SkeletonTestOrderDetails";
import OrderStatusSteps from "@/components/common/OrderStatusSteps";

const Card = ({ title, children }) => (
  <View className="bg-white rounded-2xl p-4 border border-gray-100">
    <Text className="text-base font-lexend-semibold text-gray-900 mb-4">
      {title}
    </Text>
    <View className="gap-3">{children}</View>
  </View>
);

const TextRow = ({ label, value }) => (
  <View className="flex-row justify-between items-center">
    <Text className="text-sm text-gray-500 font-lexend">{label}</Text>
    <Text className="text-sm text-gray-900 font-lexend-medium">
      {value || "N/A"}
    </Text>
  </View>
);

const DetailRow = ({ label, value }) => (
  <View className="flex-row justify-between items-center">
    <Text className="text-sm text-gray-500 font-lexend">{label}</Text>
    <Text className="text-sm text-gray-900 font-lexend-medium">{value}</Text>
  </View>
);

const Badge = ({ text, type = "pending" }) => {
  const colors = {
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <View className={`px-3 py-1 rounded-full ${colors[type]}`}>
      <Text className="text-xs font-lexend-medium">{text}</Text>
    </View>
  );
};

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
      setOrderDetails(null);
    }
  };

  useEffect(() => {
    if (testOrderId) fetchOrderDetails();
  }, [testOrderId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrderDetails().finally(() => setRefreshing(false));
  }, []);

  const getBadgeType = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("delivered")) return "delivered";
    if (s.includes("cancelled")) return "cancelled";
    return "pending";
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
    <AppLayout scroll={false}>
      <HeaderWithBack title="Test Order Details" showBackButton />

      <ScrollView
        className="bg-white rounded-xl p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && <SkeletonTestOrderDetails />}

        {!isLoading && !orderDetails && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-base text-gray-500 font-lexend text-center">
              No order details found.
            </Text>
          </View>
        )}

        {!isLoading && orderDetails && (
          <View className="gap-4">
            <Card title="Patient Info">
              <TextRow label="Name" value={customer?.fullName} />
              <TextRow label="Email" value={customer?.email} />
              <TextRow label="Phone" value={customer?.phoneNumber} />
            </Card>

            <Card title="Selected Tests">
              {selectedTests.length > 0 ? (
                <>
                  {selectedTests.map((test, idx) => (
                    <View
                      key={test._id}
                      className="flex-row justify-between items-center"
                    >
                      <Text className="text-sm text-gray-400">#{idx + 1}</Text>
                      <Text className="text-sm text-gray-800 flex-1 ml-3">
                        {test.name}
                      </Text>
                      <Text className="text-sm text-gray-900 font-lexend-semibold">
                        ₹{test.price}
                      </Text>
                    </View>
                  ))}
                  <View className="border-t border-gray-200 mt-2 pt-2 flex-row justify-between">
                    <Text className="text-sm text-gray-500 font-lexend">
                      Total
                    </Text>
                    <Text className="text-sm font-lexend-semibold text-gray-900">
                      ₹
                      {selectedTests.reduce(
                        (acc, test) => acc + (test.price || 0),
                        0
                      )}
                    </Text>
                  </View>
                </>
              ) : (
                <Text className="text-sm text-gray-400 font-lexend">
                  No tests selected.
                </Text>
              )}
            </Card>

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
              <View className="flex-row justify-between items-center pt-1">
                <Text className="text-sm text-gray-500 font-lexend">
                  Order Status
                </Text>
                <Badge
                  text={orderStatus?.replaceAll("_", " ") || "Pending"}
                  type={getBadgeType(orderStatus)}
                />
              </View>
            </Card>
            <Card title={"Order Status"}>
              <OrderStatusSteps currentStatus={orderStatus} type="pathology" />
            </Card>
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
}
