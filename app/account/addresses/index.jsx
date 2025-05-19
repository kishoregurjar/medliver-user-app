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
import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const router = useRouter();

  const { request: getAllAddresses, loading: loadingAddresses } = useAxios();

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

  const handleSetDefault = (id) => {
    setDefaultAddressId(id);
    // Call API to update default address here
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
          onPress: () => {
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            // Call API to delete address here
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const renderRightActions = (id) => (
    <TouchableOpacity
      onPress={() => handleDelete(id)}
      className="bg-red-500 justify-center items-center w-20 rounded-r-3xl"
    >
      <MaterialIcons name="delete" size={24} color="white" />
    </TouchableOpacity>
  );

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
            <Swipeable
              key={addr.id}
              renderRightActions={() => renderRightActions(addr.id)}
            >
              <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-2">
                <View className="flex-row items-center space-x-2 mb-2">
                  <MaterialIcons name="location-on" size={20} color="#5C59FF" />
                  <Text className="text-base font-semibold text-gray-800">
                    {addr.label}
                  </Text>
                  {defaultAddressId === addr.id && (
                    <View className="ml-2 bg-indigo-100 px-2 py-0.5 rounded-full">
                      <Text className="text-xs text-indigo-600 font-medium">
                        Default
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm text-gray-700">
                  {addr.addressLine}
                </Text>
                <Text className="text-sm text-gray-700">
                  {addr.city}, {addr.state} - {addr.pincode}
                </Text>
                <Text className="text-sm text-gray-700">📞 {addr.phone}</Text>

                <View className="flex-row justify-end pt-2 space-x-3">
                  <TouchableOpacity
                    className="px-4 py-1 rounded-xl bg-gray-100"
                    onPress={() => router.push(`/edit-address/${addr.id}`)}
                  >
                    <Text className="text-sm text-gray-600">Edit</Text>
                  </TouchableOpacity>
                  {defaultAddressId !== addr.id && (
                    <TouchableOpacity
                      className="px-4 py-1 rounded-xl bg-indigo-100"
                      onPress={() => handleSetDefault(addr.id)}
                    >
                      <Text className="text-sm text-indigo-600">
                        Set Default
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Swipeable>
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
