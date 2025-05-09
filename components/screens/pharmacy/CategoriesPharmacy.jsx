import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const pharmacyCategories = [
  { label: "Tablets", icon: "tablet-portrait-outline" },
  { label: "Syrups", icon: "flask-outline" },
  { label: "Supplements", icon: "nutrition-outline" },
  { label: "First Aid", icon: "medkit-outline" },
  { label: "Personal Care", icon: "people-outline" },
  { label: "Skin Care", icon: "leaf-outline" },
  { label: "Baby Care", icon: "happy-outline" },
  { label: "Medical Devices", icon: "thermometer-outline" },
];

const CategoriesPharmacy = () => {
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
        {pharmacyCategories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.8}
            className="bg-white rounded-2xl items-center justify-center p-4 w-28 mr-4 shadow-sm"
          >
            {/* Icon Circle */}
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

export default CategoriesPharmacy;
