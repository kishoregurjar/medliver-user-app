import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { MaterialIcons } from "@expo/vector-icons";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { request: getAllAddresses, loading: loadingAddresses } = useAxios();
  const { request: deleteAddress } = useAxios();
  const { request: setDefaultAddress } = useAxios();

  const fetchUserAddresses = async () => {
    const { data, error } = await getAllAddresses({
      url: "/user/get-all-address",
      method: "GET",
      authRequired: true,
    });

    if (error) {
      console.log("Error fetching user addresses:", error);
      return;
    }

    if (data?.data) {
      setAddresses(data.data);
      const defaultAddr = data.data.find((addr) => addr.isDefault);
      if (defaultAddr) setDefaultAddressId(defaultAddr.id);
    }
  };

  const handleSetDefault = async (id) => {
    if (id === defaultAddressId) return;

    setLoading(true);
    const { error } = await setDefaultAddress({
      url: `/user/set-default-address`,
      method: "PUT",
      authRequired: true,
      payload: { addressId: id },
    });
    setLoading(false);

    if (error) {
      Alert.alert("Failed", "Could not set default address.");
      return;
    }

    setDefaultAddressId(id);
    fetchUserAddresses();
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
            const original = [...addresses];
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));

            const { error } = await deleteAddress({
              url: `/user/delete-address`,
              method: "DELETE",
              authRequired: true,
              params: { addressId: id },
            });

            if (error) {
              setAddresses(original); // rollback
              Alert.alert("Failed", "Could not delete address.");
            } else {
              fetchUserAddresses();
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="My Addresses" />

      {loadingAddresses ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#5C59FF" />
          <Text className="text-sm text-gray-600 mt-2">
            Loading your addresses...
          </Text>
        </View>
      ) : addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-semibold text-gray-700">
            No Address Found
          </Text>
        </View>
      ) : (
        <ScrollView className="py-4 pb-20">
          {addresses.map((addr) => (
            <View
              key={addr._id}
              className="bg-white rounded-3xl p-5 border border-background-soft my-2"
            >
              <View className="flex-row items-center space-x-2 mb-2">
                <MaterialIcons name="location-on" size={20} color="#5C59FF" />
                <Text className="text-base font-semibold text-gray-800 capitalize">
                  {addr.address_type}
                </Text>
                {addr.is_default && (
                  <View className="ml-2 bg-indigo-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-indigo-600 font-medium">
                      Default
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-sm text-gray-700">
                {addr.house_number}, {addr.street}, {addr.landmark}
              </Text>
              <Text className="text-sm text-gray-700">
                {addr.city}, {addr.state} - {addr.pincode}
              </Text>
              <Text className="text-sm text-gray-700">{addr.country}</Text>

              <View className="flex-row justify-end pt-2 space-x-3">
                <TouchableOpacity
                  className="px-4 py-1 rounded-xl bg-gray-100"
                  onPress={() => router.push(`/edit-address/${addr._id}`)}
                >
                  <Text className="text-sm text-gray-600">Edit</Text>
                </TouchableOpacity>

                {!addr.is_default && (
                  <TouchableOpacity
                    className="px-4 py-1 rounded-xl bg-indigo-100"
                    onPress={() => handleSetDefault(addr._id)}
                    disabled={loading}
                  >
                    <Text className="text-sm text-indigo-600">
                      {loading ? "Setting..." : "Set Default"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className="px-3 py-1 rounded-xl bg-red-100"
                  onPress={() => handleDelete(addr._id)}
                >
                  <MaterialIcons name="delete" size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* add address button  */}
      <TouchableOpacity
        className="bg-brand-primary rounded-xl p-3 flex-row items-center justify-center"
        onPress={() => router.push("/account/addresses/add-address")}
      >
        <MaterialIcons name="add" size={24} color="white" />
        <Text className="text-sm text-white font-semibold">Add Address</Text>
      </TouchableOpacity>
    </AppLayout>
  );
}
