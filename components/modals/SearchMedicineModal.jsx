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

const SearchMedicineModal = ({ visible, onClose, onSelect, suggestions }) => {
  const [search, setSearch] = useState("");

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-white pt-12 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-lexendBold">Search Medicine</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Ionicons name="search" size={20} color="#6E6A7C" />
          <TextInput
            placeholder="Search medicine"
            placeholderTextColor="#6E6A7C"
            className="flex-1 ml-2 font-lexend text-sm"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Suggestions List */}
        <FlatList
          data={filteredSuggestions}
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

        {/* Upload Prescription Option */}
        <TouchableOpacity
          className="py-3 mt-5 border-t border-gray-200"
          onPress={() => {
            console.log("Upload prescription option clicked!");
            onClose();
          }}
        >
          <Text className="text-base text-app-color-red font-lexend">
            Upload Prescription
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SearchMedicineModal;
