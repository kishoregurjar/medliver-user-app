import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { label: "Medicine", icon: "medkit-outline" },
  { label: "Hospital", icon: "business-outline" },
  { label: "Pathology & Diagnosis", icon: "flask-outline" },
  { label: "Health & Fitness", icon: "fitness-outline" },
  { label: "Health Insurance", icon: "shield-checkmark-outline" },
  { label: "Ambulance", icon: "car-sport-outline" },
  { label: "Doctor", icon: "person-outline" },
  { label: "Pharmacy", icon: "storefront-outline" },
];

const CategoriesSection = () => {
  return (
    <View className="mb-6">
      {/* Heading */}
      <Text className="text-lg font-lexend-bold text-text-primary mb-4">
        Categories
      </Text>

      {/* Scrollable Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            className="flex-row items-center bg-white rounded-full px-5 py-2 mr-3 border border-background-soft"
          >
            <Ionicons
              name={cat.icon}
              size={18}
              color="#6E6A7C"
              style={{ marginRight: 8 }}
            />
            <Text className="text-[#6E6A7C] text-sm font-lexend-medium">
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoriesSection;
