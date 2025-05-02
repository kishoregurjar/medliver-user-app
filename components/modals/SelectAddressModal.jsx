import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SelectAddressModal = ({ visible, onClose, onSelect, addresses }) => {
  const [search, setSearch] = useState("");

  const filtered = addresses.filter((addr) =>
    addr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-white pt-12 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-lexendBold">
            Select Delivery Address
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Ionicons name="search" size={20} color="#6E6A7C" />
          <TextInput
            placeholder="Search address"
            placeholderTextColor="#6E6A7C"
            className="flex-1 ml-2 font-lexend text-sm"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Address List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="py-3 border-b border-gray-200"
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
    </Modal>
  );
};

export default SelectAddressModal;
