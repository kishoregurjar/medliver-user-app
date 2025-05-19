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
      url: `/user/set-default-address/${id}`,
      method: "PUT",
      authRequired: true,
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
              url: `/user/delete-address/${id}`,
              method: "DELETE",
              authRequired: true,
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
        <ScrollView className="px-4 pt-4 pb-20 space-y-4">
          {addresses.map((addr) => (
            <View
              key={addr._id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-2"
            >
              <View className="flex-row items-center space-x-2 mb-2">
                <MaterialIcons name="location-on" size={20} color="#5C59FF" />
                <Text className="text-base font-semibold text-gray-800">
                  {addr.label}
                </Text>
                {defaultAddressId === addr._id && (
                  <View className="ml-2 bg-indigo-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-indigo-600 font-medium">
                      Default
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-sm text-gray-700">{addr.addressLine}</Text>
              <Text className="text-sm text-gray-700">
                {addr.city}, {addr.state} - {addr.pincode}
              </Text>
              <Text className="text-sm text-gray-700">📞 {addr.phone}</Text>

              <View className="flex-row justify-end pt-2 space-x-3">
                <TouchableOpacity
                  className="px-4 py-1 rounded-xl bg-gray-100"
                  onPress={() => router.push(`/edit-address/${addr._id}`)}
                >
                  <Text className="text-sm text-gray-600">Edit</Text>
                </TouchableOpacity>

                {defaultAddressId !== addr._id && (
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

      {/* Floating Add Address Button */}
      <TouchableOpacity
        onPress={() => router.push("/account/addresses/add-address")}
        className="absolute bottom-6 right-6 bg-indigo-600 p-4 rounded-full shadow-lg"
      >
        <MaterialIcons name="add-location-alt" size={28} color="white" />
      </TouchableOpacity>
    </AppLayout>
  );
}
