import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import UserAddressSelection from "@/components/common/UserAddressSelection";
import UserPaymentOptions from "@/components/common/UserPaymentOptions";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import { Image } from "react-native";
import SkeletonTestDetailsBook from "@/components/skeletons/SkeletonTestDetailsBook";
import { useAppToast } from "@/hooks/useAppToast";

export default function BookTestScreen() {
  const router = useRouter();
  const { testId } = useLocalSearchParams();

  const { showToast } = useAppToast();

  const { request: getTestDetails, loading: isLoading } = useAxios();
  const { request: initiateUserBooking, loading: initiateBookingLoading } =
  useAxios();
  const [testDetails, setTestDetails] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handlePlaceOrder = async () => {
    let initiateBooking = {
      test_ids: [testId],
      deliveryAddressId: selectedAddress,
      paymentMethod: selectedPayment,
    };

    console.log("Placing Booking with details:", initiateBooking);

    const { data, error } = await initiateUserBooking({
      url: "/user/test-booking",
      method: "POST",
      payload: initiateBooking,
      authRequired: true,
    });

    console.log("Booking test response:", data);

    if (error) {
      console.error("Booking test failed:", error);
      showToast("error", error || "Failed to Book test. Please try again.");
      return;
    }
    if (data?.status === 201 && data?.data) {
      showToast("success", data?.message || "Booking test successfully!");
      router.push(ROUTE_PATH.APP.ORDERS.INDEX);
    } else {
      showToast("error", data?.message || "Failed to book test.");
    }
  };

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!testId) return;

      const { data, error } = await getTestDetails({
        method: "GET",
        url: `/user/get-test-details`,
        authRequired: true,
        params: { testId },
      });

      if (!error && data.status === 200) {
        setTestDetails(data.data);
      } else {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [testId]);

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Book Test" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <SkeletonTestDetailsBook />
        ) : testDetails ? (
          <View className="bg-white px-4 py-3 flex gap-3 rounded-2xl">
            <Text className="text-xl font-lexend-bold text-text-primary">
              {testDetails.name}
            </Text>

            <Text className="text-sm font-lexend text-text-muted">
              {testDetails.description}
            </Text>

            {testDetails.categoryId?.image_url && (
              <Image
                source={{ uri: testDetails.categoryId.image_url }}
                className="w-full h-32 rounded-lg object-contain bg-gray-100"
                resizeMode="contain"
              />
            )}

            <View className="flex gap-2">
              <Text className="text-base font-lexend-semibold text-text-primary">
                Price: ₹{testDetails.price}
              </Text>
              <Text className="text-sm font-lexend text-text-muted">
                Sample Required: {testDetails.sample_required}
              </Text>
              <Text className="text-sm font-lexend text-text-muted">
                Test Code: {testDetails.test_code}
              </Text>
              <Text className="text-sm font-lexend text-text-muted">
                Category: {testDetails.categoryId?.name}
              </Text>
              <Text className="text-sm font-lexend text-text-muted">
                At Home Collection:{" "}
                {testDetails.available_at_home ? "Yes" : "No"}
              </Text>
              <Text className="text-sm font-lexend text-text-muted">
                Preparation: {testDetails.preparation}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-center text-gray-500 mt-4">Test not found</Text>
        )}

        <UserAddressSelection
          onSelectDeliveryAddress={(id) => {
            console.log("Selected address ID:", id);
            setSelectedAddress(id);
          }}
          onAddAddressPress={() =>
            router.push(ROUTE_PATH.APP.ACCOUNT.ADD_ADDRESS)
          }
        />
        <UserPaymentOptions
          onSelectPaymentMethod={(method) => setSelectedPayment(method)}
          onPlaceOrder={handlePlaceOrder}
          isInitiatingOrder={initiateBookingLoading}
          type="pathology"
        />
      </ScrollView>
    </AppLayout>
  );
}
