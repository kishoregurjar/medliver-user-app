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
import LoadingDots from "@/components/common/LoadingDots";

export default function ViewPrescriptionScreen() {
  const { prescriptionId } = useLocalSearchParams();
  const { request, loading: isLoading } = useAxios();
  const [prescription, setPrescription] = useState(null);

  const fetchPrescription = async () => {
    try {
      const { data } = await request({
        method: "GET",
        url: `/user/get-prescription-details-by-id`,
        authRequired: true,
        params: { prescriptionId },
      });

      if (data?.status === 200 && data?.data) {
        setPrescription(data.data.prescription);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch prescription.");
    }
  };

  useEffect(() => {
    if (prescriptionId) fetchPrescription();
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
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700" };
      case "assigned_to_pharmacy":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      default:
        return { bg: "bg-gray-200", text: "text-gray-600" };
    }
  };

  if (isLoading || !prescription) {
    return (
      <AppLayout scroll={false}>
        <HeaderWithBack showBackButton title="Prescription Details" />
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots
            title="Loading Prescription..."
            subtitle="Please wait while we fetch your data"
          />
        </View>
      </AppLayout>
    );
  }

  const {
    status,
    created_at,
    bill_path,
    prescriptions = [],
    remarks,
    total_amount,
    assigned_delivery_partner,
    assigned_pharmacy,
    deliveryAddress,
    prescriptionNumber,
  } = prescription;

  const { bg, text } = getStatusBadgeStyle(status);

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Prescription Details" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        contentContainerClassName="bg-white p-4 rounded-xl gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* --- Meta Info Block --- */}
        <View className="bg-white rounded-2xl p-4 gap-4 border border-gray-200">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-lexend-semibold text-gray-800">
              {prescriptionNumber}
            </Text>
            <View className={`px-3 py-1 rounded-full ${bg}`}>
              <Text
                className={`text-xs font-lexend-semibold capitalize ${text}`}
              >
                {status?.replaceAll("_", " ")}
              </Text>
            </View>
          </View>

          {/* Created Time */}
          <View>
            <Text className="text-sm font-lexend-semibold text-gray-500 mb-1">
              Submitted On
            </Text>
            <Text className="text-sm font-lexend-medium text-gray-800">
              {formatDate(created_at)}
            </Text>
          </View>

          {/* Total Amount */}
          <View>
            <Text className="text-sm font-lexend-semibold text-gray-500 mb-1">
              Total Amount
            </Text>
            <Text className="text-sm font-lexend-medium text-gray-800">
              ₹{total_amount ? total_amount.toFixed(2) : "0.00"}
            </Text>
          </View>

          {/* Delivery Address */}
          {deliveryAddress?.street && (
            <View>
              <Text className="text-sm font-lexend-semibold text-gray-500 mb-1">
                Delivery Address
              </Text>
              <Text className="text-sm font-lexend-medium text-gray-800">
                {deliveryAddress.street}, {deliveryAddress.city} -{" "}
                {deliveryAddress.pincode}
              </Text>
            </View>
          )}

          {/* Assigned Pharmacy */}
          <View>
            <Text className="text-sm font-lexend-semibold text-gray-500 mb-1">
              Assigned Pharmacy
            </Text>
            <Text className="text-sm font-lexend-medium text-gray-800">
              {assigned_pharmacy?.name || "Not Assigned"}
            </Text>
          </View>

          {/* Assigned Delivery Partner */}
          <View>
            <Text className="text-sm font-lexend-semibold text-gray-500 mb-1">
              Delivery Partner
            </Text>
            <Text className="text-sm font-lexend-medium text-gray-800">
              {assigned_delivery_partner?.name || "Not Assigned"}
            </Text>
          </View>

          {/* Remarks */}
          {remarks && (
            <View>
              <Text className="text-sm text-gray-500 mb-1">Remarks</Text>
              <Text className="text-sm font-lexend-regular text-gray-800">
                {remarks}
              </Text>
            </View>
          )}

          {/* View Bill */}
          {bill_path && (
            <TouchableOpacity
              onPress={() => openLink(bill_path)}
              className="flex-row items-center gap-2 mt-1"
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

        {/* --- Prescription Images Block --- */}
        <View className="bg-white rounded-2xl p-4 border border-gray-200">
          <Text className="text-lg font-lexend-semibold text-gray-800 mb-3">
            Prescription Images
          </Text>

          {prescriptions.length === 0 ? (
            <View className="p-4 bg-gray-50 rounded-xl items-center">
              <MaterialIcons
                name="image-not-supported"
                size={24}
                color="#999"
              />
              <Text className="text-gray-500 mt-2 text-sm">
                No prescription images uploaded.
              </Text>
            </View>
          ) : (
            prescriptions.map((img, index) => (
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
