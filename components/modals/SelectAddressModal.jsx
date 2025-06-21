import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useAxios from "@/hooks/useAxios";
import LoadingDots from "../common/LoadingDots";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";

export default function SelectAddressModal({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const { request: fetchAddresses, loading } = useAxios();
  const router = useRouter();

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  useEffect(() => {
    if (visible) {
      fetchAddresses({
        method: "GET",
        url: "/user/get-all-address",
        authRequired: true,
      }).then(({ data, error }) => {
        if (!error && data?.data) {
          setAddresses(data.data);
        }
      });
    }
  }, [visible]);

  const handleSelect = (address) => {
    setSelected(address);
    onSelect?.(address);
    close();
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={open}
        activeOpacity={0.85}
        className="flex-row items-center justify-between border-2 border-brand-primary p-3 rounded-2xl"
      >
        <View className="flex-1 pr-2">
          <Text className="text-sm font-lexend text-gray-500 mb-1">
            {selected ? "Delivering to:" : "Select Delivery Address"}
          </Text>
          <Text
            className="text-sm font-lexend-semibold text-text-primary"
            numberOfLines={2}
          >
            {selected
              ? [
                  selected.house_number,
                  selected.street,
                  selected.landmark,
                  selected.city,
                  selected.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "Tap to choose where to deliver"}
          </Text>
        </View>
        <AntDesign name="down" size={16} color="#B31F24" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={close}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl px-4 pt-4 pb-6 max-h-[80%]">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-lexend-semibold">
                Select Address
              </Text>
              <TouchableOpacity onPress={close}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* Address List */}
            {loading ? (
              <View className="flex-1 justify-center items-center">
                <LoadingDots
                  title={"Loading Addresses..."}
                  subtitle={"Please wait..."}
                />
              </View>
            ) : addresses.length === 0 ? (
              <Text className="text-center text-gray-400 py-4">
                No addresses found.
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                {addresses.map((address) => (
                  <Pressable
                    key={address._id}
                    onPress={() => handleSelect(address)}
                    className={`relative rounded-2xl px-4 py-5 mb-3 border bg-white ${
                      selected?._id === address._id
                        ? "border-gray-200 border-r-[6px] border-r-brand-primary"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Selected Badge */}
                    {selected?._id === address._id && (
                      <View className="absolute top-3 right-3 bg-brand-primary px-2 py-0.5 rounded-full z-10">
                        <Text className="text-white text-xs font-lexend-medium">
                          Selected
                        </Text>
                      </View>
                    )}

                    {/* Header Row */}
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-lexend-semibold capitalize text-brand-primary">
                        {address.address_type || "Other"}
                      </Text>
                      {address.is_default && (
                        <View className="bg-green-100 px-2 py-1 rounded-full">
                          <Text className="text-xs text-green-700 font-lexend-medium">
                            Default
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Full Address */}
                    <Text className="text-base font-lexend-medium text-gray-900 mb-0.5">
                      {[address.house_number, address.street, address.landmark]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-0.5">
                      {[address.city, address.state].filter(Boolean).join(", ")}
                      {address.pincode ? ` - ${address.pincode}` : ""}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {address.country || "India"}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Add Address Button */}
            <TouchableOpacity
              onPress={() => {
                close();
                router.push(ROUTE_PATH.APP.ACCOUNT.ADD_ADDRESS);
              }}
              className="my-2 py-3 rounded-xl bg-brand-primary items-center"
            >
              <Text className="text-white font-lexend-semibold text-base">
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
