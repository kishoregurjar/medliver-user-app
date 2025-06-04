import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import useAxios from "@/hooks/useAxios";
import SkeletonAddressCard from "@/components/skeletons/SkeletonAddressCard";
import { useRouter } from "expo-router";
import CTAButton from "../common/CTAButton";

export default function UserAddressSelection({
  onSelectDeliveryAddress = () => {
    console.log("Address selected:", id);
  }, // Callback when an address is selected
  onAddAddressPress = () => {
    console.log("Add address pressed");
  }, // Optional: to navigate to Add Address screen
}) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const router = useRouter();
  const { request: getAllAddresses, loading: loadingAddresses } = useAxios();

  const fetchUserAddresses = async () => {
    const { data, error } = await getAllAddresses({
      url: "/user/get-all-address",
      method: "GET",
      authRequired: true,
    });

    if (error) {
      console.error("Error fetching addresses:", error);
      return;
    }

    if (data?.data) {
      setAddresses(data.data);
      const defaultAddr = data.data.find((addr) => addr.is_default);
      const defaultId = defaultAddr?._id ?? data.data[0]?._id;
      setSelectedAddressId(defaultId);
      onSelectDeliveryAddress?.(defaultId);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserAddresses();
    }, [])
  );

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    onSelectDeliveryAddress?.(id);
  };

  const renderAddressItem = (addr) => {
    const isSelected = selectedAddressId === addr._id;

    return (
      <TouchableOpacity
        key={addr._id}
        onPress={() => handleAddressSelect(addr._id)}
        activeOpacity={0.9}
        className={`relative border rounded-xl px-4 py-3 mb-2 ${
          isSelected
            ? "border-brand-primary bg-brand-primary/10"
            : "border-background-soft"
        }`}
      >
        <View className="flex-row justify-between">
          <View className="flex-1 pr-6">
            <Text
              className={`text-base font-lexend-medium mb-1 capitalize ${
                isSelected ? "text-brand-primary" : "text-text-primary"
              }`}
            >
              {addr.address_type || "Address"}{" "}
              <Text className="text-xs text-text-muted uppercase">
                ({addr.country})
              </Text>
            </Text>

            <Text className="text-sm font-lexend text-text-muted">
              {addr.house_number}, {addr.street}
            </Text>
            <Text className="text-sm font-lexend text-text-muted">
              {addr.city}, {addr.state} - {addr.pincode}
            </Text>

            {addr.landmark ? (
              <Text className="text-sm font-lexend text-text-muted">
                Landmark: {addr.landmark}
              </Text>
            ) : null}
          </View>

          <MaterialIcons
            name={
              isSelected ? "radio-button-checked" : "radio-button-unchecked"
            }
            size={22}
            color={isSelected ? "#B31F24" : "#9CA3AF"}
            style={{ position: "absolute", top: 12, right: 12 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white rounded-2xl p-4 my-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-lexend-semibold text-text-muted">
          Delivery Address
        </Text>
        <CTAButton
          iconOnly
          icon={<Feather name="refresh-cw" size={20} color="#6B7280" />}
          variant="transparent"
          onPress={fetchUserAddresses}
          size="sm"
        />
      </View>

      {loadingAddresses ? (
        <View className="gap-2 mt-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonAddressCard key={i} />
          ))}
        </View>
      ) : addresses.length === 0 ? (
        <View className="items-center justify-center py-6">
          <Text className="text-base font-lexend text-text-muted">
            No Address Found
          </Text>
        </View>
      ) : (
        <View className="gap-3">{addresses.map(renderAddressItem)}</View>
      )}

      <TouchableOpacity
        onPress={onAddAddressPress}
        className="mt-4 py-3 rounded-xl bg-brand-primary items-center"
        activeOpacity={0.8}
      >
        <Text className="font-lexend-medium text-base text-white">
          Add New Address
        </Text>
      </TouchableOpacity>
    </View>
  );
}
