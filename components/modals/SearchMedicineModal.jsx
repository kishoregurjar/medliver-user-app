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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const SearchMedicineModal = ({ visible, onClose, onSelect, suggestions }) => {
  const [search, setSearch] = useState("");

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
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
                Search Medicine
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#6E6A7C" />
              <TextInput
                placeholder="Search medicine"
                placeholderTextColor="#6E6A7C"
                className="flex-1 ml-2 text-base font-lexend text-gray-800"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Suggestions List */}
            <FlatList
              data={filteredSuggestions}
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
              ListEmptyComponent={
                <Text className="text-center text-gray-400 mt-6 font-lexend">
                  No results found
                </Text>
              }
            />

            {/* Upload Prescription Option */}
            <TouchableOpacity
              className="mt-6 border-t border-gray-200 pt-4"
              onPress={() => {
                console.log("Upload prescription option clicked!");
                onClose();
              }}
            >
              <Text className="text-center text-base text-red-500 font-lexend">
                Upload Prescription
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SearchMedicineModal;
