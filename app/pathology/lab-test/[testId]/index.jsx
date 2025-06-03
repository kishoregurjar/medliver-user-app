import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useLocalSearchParams } from "expo-router";

export default function PathologyTestDetailsScreen() {
  const { testId } = useLocalSearchParams();

  const [testDetails, setTestDetails] = useState(null);
  const { request: getTestDetails, loading: isLoading } = useAxios();

  useEffect(() => {
    const fetchTestDetails = async () => {
      const { data, error } = await getTestDetails({
        method: "GET",
        url: `/user/get-test-details`,
        authRequired: true,
        params: { testId },
      });

      if (!error && data?.status === 200) {
        setTestDetails(data.data);
      } else {
        console.error("Error fetching test details:", error);
      }
    };

    if (testId) {
      fetchTestDetails();
    }
  }, [testId]);

  const renderDetailRow = (label, value) => (
    <View className="mt-3 flex-row">
      <Text className="font-lexend-bold text-text-primary w-40">{label}:</Text>
      <Text className="flex-1 font-lexend text-text-muted">
        {value || "N/A"}
      </Text>
    </View>
  );

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Test Details" />
      <View className="flex-1 p-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#5C59FF" />
            <Text className="mt-2 text-base text-text-muted">
              Loading Test Details...
            </Text>
          </View>
        ) : testDetails ? (
          <ScrollView className="flex-1">
            <View className="p-4 bg-white rounded-2xl">
              <Text className="text-2xl font-lexend-bold text-[#212121]">
                {testDetails.name || "Untitled Test"}
              </Text>
              {testDetails.description ? (
                <Text className="text-sm font-lexend text-text-muted my-2">
                  {testDetails.description}
                </Text>
              ) : null}

              <View className="mt-4 border-t border-gray-200 pt-2">
                {renderDetailRow("Test Code", testDetails.test_code)}
                {renderDetailRow("Price", `₹${testDetails.price}`)}
                {renderDetailRow(
                  "Sample Required",
                  testDetails.sample_required
                )}
                {renderDetailRow("Preparation", testDetails.preparation)}
                {renderDetailRow("Delivery Time", testDetails.deliveryTime)}
                {renderDetailRow(
                  "Available",
                  testDetails.available ? "Yes" : "No"
                )}
                {renderDetailRow(
                  "Available at Home",
                  testDetails.available_at_home ? "Yes" : "No"
                )}
                {renderDetailRow(
                  "Created At",
                  new Date(testDetails.createdAt).toLocaleDateString()
                )}
                {renderDetailRow(
                  "Last Updated",
                  new Date(testDetails.updatedAt).toLocaleDateString()
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-base font-lexend text-text-muted">
              No Test Details Found.
            </Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
}
