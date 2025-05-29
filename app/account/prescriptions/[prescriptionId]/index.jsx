import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";

export default function ViewPrescriptionScreen() {
  const { prescriptionId } = useLocalSearchParams();
  const { request, loading } = useAxios();
  const [prescription, setPrescription] = useState(null);

  const fetchPrescription = async () => {
    const { data, error } = await request({
      method: "GET",
      url: `/user/get-prescription-details-by-id`,
      authRequired: true,
      params: { prescriptionId },
    });

    if (data?.status === 200 && data?.data) {
      setPrescription(data.data.prescription);
    } else {
      Alert.alert("Error", "Failed to fetch prescription.");
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [prescriptionId]);

  const openLink = (url) => {
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open the link.")
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  if (loading || !prescription) {
    return (
      <AppLayout>
        <HeaderWithBack showBackButton title="Prescription Details" />
        <View className="bg-white m-4 p-4 rounded-2xl flex gap-2">
          <View className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          <View className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <View className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2" />
          <View className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <View className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <View className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-4" />
          <View className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2" />
          <View className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
        </View>
      </AppLayout>
    );
  }

  const {
    status,
    created_at,
    bill_path,
    prescriptions: images = [],
    remarks,
    total_amount,
    assigned_delivery_partner,
    assigned_pharmacy,
  } = prescription;

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Prescription Details" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white p-4 rounded-2xl shadow-sm">
          <Text className="text-lg font-lexend-semibold mb-2">Status:</Text>
          <Text className="text-brand-primary font-lexend-medium capitalize">
            {status || "N/A"}
          </Text>

          <Text className="text-lg font-lexend-semibold mt-4 mb-2">
            Submitted At:
          </Text>
          <Text className="text-gray-700 font-lexend-medium">
            {formatDate(created_at)}
          </Text>

          <Text className="text-lg font-lexend-semibold mt-4 mb-2">
            Total Amount:
          </Text>
          <Text className="text-gray-700 font-lexend-medium">
            ₹{total_amount?.toFixed(2) ?? "0.00"}
          </Text>

          <Text className="text-lg font-lexend-semibold mt-4 mb-2">
            Assigned Pharmacy:
          </Text>
          <Text className="text-gray-700 font-lexend-medium">
            {assigned_pharmacy?.name || "Not assigned"}
          </Text>

          <Text className="text-lg font-lexend-semibold mt-4 mb-2">
            Assigned Delivery Partner:
          </Text>
          <Text className="text-gray-700 font-lexend-medium">
            {assigned_delivery_partner?.name || "Not assigned"}
          </Text>

          {remarks && (
            <>
              <Text className="text-lg font-lexend-semibold mt-4 mb-2">
                Remarks:
              </Text>
              <Text className="text-gray-700">{remarks}</Text>
            </>
          )}

          {bill_path && (
            <TouchableOpacity
              onPress={() => openLink(bill_path)}
              className="mt-6 flex-row items-center space-x-2"
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#4F46E5"
              />
              <Text className="text-brand-primary underline font-lexend-medium">
                View Bill
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-6">
          <Text className="text-lg font-lexend-semibold mb-3">
            Prescription Images:
          </Text>
          {images.length === 0 ? (
            <Text className="text-gray-500">No images uploaded</Text>
          ) : (
            images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.path }}
                className="w-full h-64 mb-4 rounded-xl"
                resizeMode="cover"
              />
            ))
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
}
