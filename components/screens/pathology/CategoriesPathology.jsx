import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const pathologyCategories = [
  { label: "Blood Test", icon: "water-outline" },
  { label: "Urine Test", icon: "flask-outline" },
  { label: "COVID-19", icon: "medkit-outline" },
  { label: "Thyroid", icon: "pulse-outline" },
  { label: "Diabetes", icon: "analytics-outline" },
  { label: "Liver Function", icon: "body-outline" },
  { label: "Kidney Test", icon: "medkit-outline" },
];

const CategoriesPathology = () => {
  return (
    <View className="mb-6">
      {/* Heading */}
      <Text className="text-lg font-lexend-bold text-text-primary mb-4">
        Categories
      </Text>

      {/* Scrollable Category Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {pathologyCategories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.8}
            className="bg-white rounded-2xl items-center justify-center p-4 w-28 mr-4 shadow-sm"
          >
            {/* Icon */}
            <View className="bg-background-soft p-3 rounded-full mb-2">
              <Ionicons name={cat.icon} size={26} color="#6E6A7C" />
            </View>

            {/* Label */}
            <Text className="text-xs text-center font-lexend-medium text-text-primary">
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoriesPathology;
