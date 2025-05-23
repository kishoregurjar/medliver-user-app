import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { MaterialIcons } from "@expo/vector-icons";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";
import SkeletonAddressCard from "@/components/skeletons/SkeletonAddressCard";
import UserAddressCard from "@/components/cards/UserAddressCard";

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [activeSetId, setActiveSetId] = useState(null);

  const router = useRouter();
  const { request: getAllAddresses, loading: loadingAddresses } = useAxios();
  const { request: deleteAddress, loading: deleting } = useAxios();
  const { request: setDefaultAddress, loading: settingDefaultLoading } =
    useAxios();

  const fetchUserAddresses = async () => {
    const { data, error } = await getAllAddresses({
      url: "/user/get-all-address",
      method: "GET",
      authRequired: true,
    });

    if (error) {
      console.error("Error fetching user addresses:", error);
      return;
    }

    if (data?.data) {
      setAddresses(data.data);
      const defaultAddr = data.data.find((addr) => addr.is_default);
      if (defaultAddr) setDefaultAddressId(defaultAddr._id);
    }
  };

  const handleSetDefault = async (id) => {
    if (id === defaultAddressId || settingDefaultLoading) return;

    setActiveSetId(id);

    const { error } = await setDefaultAddress({
      url: `/user/set-default-address`,
      method: "PUT",
      authRequired: true,
      payload: { addressId: id },
    });

    setActiveSetId(null);

    if (error) {
      Alert.alert("Failed", "Could not set default address.");
      return;
    }

    setDefaultAddressId(id);
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addr._id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await deleteAddress({
              url: `/user/delete-address`,
              method: "DELETE",
              authRequired: true,
              params: { addressId: id },
            });

            if (error) {
              Alert.alert("Failed", "Could not delete address.");
              return;
            }

            // Remove from UI
            setAddresses((prev) => prev.filter((addr) => addr._id !== id));

            // If deleted address was default, unset it
            if (defaultAddressId === id) {
              setDefaultAddressId(null);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserAddresses(); // Refetch on screen focus
    }, [])
  );

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="My Addresses" />

      {loadingAddresses ? (
        Array.from({ length: 3 }, (_, index) => (
          <SkeletonAddressCard key={`skeleton-${index}`} />
        ))
      ) : addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-semibold text-gray-700">
            No Address Found
          </Text>
        </View>
      ) : (
        <ScrollView className="py-4 pb-20">
          {addresses.map((addr) => (
            <UserAddressCard
              key={addr._id}
              address={addr}
              onEdit={(id) => router.push(`/account/addresses/edit/${id}`)}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
              settingDefault={settingDefaultLoading}
              activeSetId={activeSetId}
            />
          ))}
        </ScrollView>
      )}

      {/* Add Address Floating Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-brand-primary p-4 rounded-full flex-row items-center justify-center space-x-1"
        onPress={() => router.push("/account/addresses/add-address")}
      >
        <MaterialIcons name="add-location-alt" size={24} color="white" />
        <Text className="text-white font-medium text-sm">Add Address</Text>
      </TouchableOpacity>
    </AppLayout>
  );
}
