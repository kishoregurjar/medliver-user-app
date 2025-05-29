import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, Alert, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";
import SkeletonAddressCard from "@/components/skeletons/SkeletonAddressCard";
import UserAddressCard from "@/components/cards/UserAddressCard";
import CTAButton from "@/components/common/CTAButton";
import ROUTE_PATH from "@/routes/route.constants";
import { Ionicons } from "@expo/vector-icons";

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [activeSetId, setActiveSetId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // new

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserAddresses();
    setRefreshing(false);
  }, []);

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

            setAddresses((prev) => prev.filter((addr) => addr._id !== id));

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
      fetchUserAddresses();
    }, [])
  );

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="My Addresses" />

      <CTAButton
        label="Add New Address"
        onPress={() => router.push(ROUTE_PATH.APP.ACCOUNT.ADD_ADDRESS)}
        icon={<Ionicons name="add" size={24} color="white" className="mr-2" />}
      />

      {loadingAddresses ? (
        <View className="flex gap-2 my-4">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonAddressCard key={`skeleton-${index}`} />
          ))}
        </View>
      ) : addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-semibold text-gray-700">
            No Address Found
          </Text>
        </View>
      ) : (
        <ScrollView
          className="py-4 pb-20"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {addresses.map((addr) => (
            <UserAddressCard
              key={addr._id}
              address={addr}
              onEdit={(id) => router.push(`/account/addresses/edit/${id}`)}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
              settingDefault={settingDefaultLoading}
              activeSetId={activeSetId}
              isDeleting={deleting}
            />
          ))}
        </ScrollView>
      )}
    </AppLayout>
  );
}
