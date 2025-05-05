import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const SelectAddressModal = ({ visible, onClose, onSelect, addresses }) => {
  const [search, setSearch] = useState("");

  const filtered = addresses.filter((addr) =>
    addr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/30">
          <View
            className="bg-white rounded-t-[32px] px-5 pt-6 pb-4"
            style={{ height: height * 0.85 }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-lexendBold text-black">
                Select Delivery Address
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#6E6A7C" />
              <TextInput
                placeholder="Search address"
                placeholderTextColor="#6E6A7C"
                className="flex-1 ml-2 text-base font-lexend text-gray-800"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Address List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 px-2 border-b border-gray-100 active:bg-gray-50 rounded-md"
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text className="text-base text-gray-800 font-lexend">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectAddressModal;
