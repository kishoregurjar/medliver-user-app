import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const offersData = [
  {
    title: "50% Off on All Medicines",
    description: "Get 50% off on selected medicines for a limited time.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Free Delivery on Orders Above $50",
    description: "Enjoy free delivery on orders above $50.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Buy 1 Get 1 Free on Vitamins",
    description: "Buy one bottle of vitamins and get another free.",
    image: "https://via.placeholder.com/150",
  },
];

const OffersScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack title="Offers" />
      
      <View className="flex-1">
        {/* Scrollable Content */}
        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Offers List Section */}
          <View className="bg-white p-4 rounded-3xl shadow-md">
            {offersData.map((offer, index) => (
              <View
                key={index}
                className="flex-row items-center p-4 rounded-xl mb-4 bg-gray-50"
              >
                <Image
                  source={{ uri: offer.image }}
                  className="w-16 h-16 rounded-lg mr-4"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {offer.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {offer.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default OffersScreen;
