import React, { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import CTAButton from "@/components/common/CTAButton";
import UserAddressCard from "@/components/cards/UserAddressCard";
import LoadingDots from "@/components/common/LoadingDots";
import ROUTE_PATH from "@/routes/route.constants";
import useAxios from "@/hooks/useAxios";
import { Ionicons } from "@expo/vector-icons";
import PaginatedList from "@/components/common/PaginatedList";

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSetId, setActiveSetId] = useState(null);

  const router = useRouter();
  const { request: getAllAddresses, loading: loadingAddresses } = useAxios();
  const { request: deleteAddress, loading: isDeleting } = useAxios();
  const { request: setDefaultAddress, loading: settingDefault } = useAxios();

  const fetchUserAddresses = useCallback(async () => {
    const { data, error } = await getAllAddresses({
      url: "/user/get-all-address",
      method: "GET",
      authRequired: true,
    });

    if (error) {
      console.error("Fetch Error:", error);
      return;
    }

    const fetched = data?.data || [];
    setAddresses(fetched);
    const defaultAddr = fetched.find((a) => a.is_default);
    setDefaultAddressId(defaultAddr?._id || null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserAddresses();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserAddresses();
    setRefreshing(false);
  }, [fetchUserAddresses]);

  const handleSetDefault = useCallback(
    async (id) => {
      if (id === defaultAddressId || settingDefault) return;
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
    },
    [defaultAddressId, settingDefault]
  );

  const handleDelete = useCallback(
    (id) => {
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
                url: "/user/delete-address",
                method: "DELETE",
                authRequired: true,
                params: { addressId: id },
              });

              if (error) {
                Alert.alert("Failed", "Could not delete address.");
                return;
              }

              setAddresses((prev) => prev.filter((addr) => addr._id !== id));
              if (id === defaultAddressId) setDefaultAddressId(null);
            },
          },
        ]
      );
    },
    [defaultAddressId]
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack title="My Addresses" showBackButton />

      <CTAButton
        label="Add New Address"
        onPress={() => router.push(ROUTE_PATH.APP.ACCOUNT.ADD_ADDRESS)}
        icon={<Ionicons name="add" size={24} color="white" />}
        className={"my-4"}
      />

      <PaginatedList
        data={addresses}
        renderItem={({ item }) => (
          <UserAddressCard
            address={item}
            isDeleting={isDeleting}
            settingDefault={settingDefault}
            activeSetId={activeSetId}
            onEdit={() => router.push(`/account/addresses/edit/${item._id}`)}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        loading={loadingAddresses}
        showSearch={false}
        keyExtractor={(item) => item._id}
        contentContainerClassName="pb-20"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-xl font-semibold text-gray-700">
              No Address Found
            </Text>
          </View>
        }
      />
    </AppLayout>
  );
}
