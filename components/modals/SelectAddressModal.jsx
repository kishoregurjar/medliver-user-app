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

export default function SelectAddressModal({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const { request: fetchAddresses, loading } = useAxios();

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
          console.log("data", data.data);

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
        activeOpacity={0.8}
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
          <View className="bg-white rounded-t-2xl p-4 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-lexend-semibold">
                Select Address
              </Text>
              <TouchableOpacity onPress={close}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="flex-1 justify-center">
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
              <ScrollView showsVerticalScrollIndicator={false}>
                {addresses.map((address) => (
                  <Pressable
                    key={address._id}
                    onPress={() => handleSelect(address)}
                    className={`rounded-2xl px-4 py-5 mb-3 border transition-all ${
                      selected?._id === address._id
                        ? "border-2 border-brand-primary"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Address Type + Tag Row */}
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-lexend-semibold capitalize text-primary">
                        {address.address_type || "Other"}
                      </Text>

                      {address.is_default && (
                        <View className="bg-green-100 px-2 py-1 rounded-full">
                          <Text className="text-sm text-green-700 font-lexend-medium">
                            Default
                          </Text>
                        </View>
                      )}
                      {selected?._id === address._id && !address.is_default && (
                        <View className="bg-primary px-2 py-0.5 rounded-full">
                          <Text className="text-xs text-white font-lexend-medium">
                            Selected
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
          </View>
        </View>
      </Modal>
    </>
  );
}
