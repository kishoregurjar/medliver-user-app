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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";

export default function ViewPrescriptionScreen() {
  const { prescriptionId } = useLocalSearchParams();
  const { request, loading } = useAxios();
  const [prescription, setPrescription] = useState(null);

  const fetchPrescription = async () => {
    const { data } = await request({
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
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700" };
      default:
        return { bg: "bg-gray-200", text: "text-gray-600" };
    }
  };

  if (loading || !prescription) {
    return (
      <AppLayout>
        <HeaderWithBack showBackButton title="Prescription Details" />
        <View className="m-4 p-4 bg-white rounded-xl space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"
            />
          ))}
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

  const { bg, text } = getStatusBadgeStyle(status);

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Prescription Details" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white rounded-2xl p-4 space-y-4">
          {/* Status */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-lexend-semibold">Status</Text>
            <View className={`px-3 py-1 rounded-full ${bg}`}>
              <Text className={`text-sm font-medium capitalize ${text}`}>
                {status}
              </Text>
            </View>
          </View>

          {/* Submission Time */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">Submitted On</Text>
            <Text className="font-lexend-medium text-gray-800">
              {formatDate(created_at)}
            </Text>
          </View>

          {/* Amount */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">Total Amount</Text>
            <Text className="font-lexend-medium text-gray-800">
              ₹{total_amount?.toFixed(2) ?? "0.00"}
            </Text>
          </View>

          {/* Pharmacy Info */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">
              Assigned Pharmacy
            </Text>
            <Text className="font-lexend-medium text-gray-800">
              {assigned_pharmacy?.name || "Not Assigned"}
            </Text>
          </View>

          {/* Delivery Partner Info */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">Delivery Partner</Text>
            <Text className="font-lexend-medium text-gray-800">
              {assigned_delivery_partner?.name || "Not Assigned"}
            </Text>
          </View>

          {/* Remarks */}
          {remarks && (
            <View>
              <Text className="text-sm text-gray-500 mb-1">Remarks</Text>
              <Text className="font-lexend-regular text-gray-800">
                {remarks}
              </Text>
            </View>
          )}

          {/* View Bill */}
          {bill_path && (
            <TouchableOpacity
              onPress={() => openLink(bill_path)}
              className="flex-row items-center space-x-2 mt-2"
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#4F46E5"
              />
              <Text className="text-brand-primary underline font-lexend-medium">
                View Bill
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Images */}
        <View className="mt-6">
          <Text className="text-lg font-lexend-semibold mb-3">
            Prescription Images
          </Text>

          {images.length === 0 ? (
            <View className="p-4 bg-gray-50 rounded-xl items-center">
              <MaterialIcons
                name="image-not-supported"
                size={24}
                color="#999"
              />
              <Text className="text-gray-500 mt-2 text-sm">
                No images uploaded.
              </Text>
            </View>
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
