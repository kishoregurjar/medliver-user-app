import STATIC from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";

const TopPicksSection = () => {
  const topPicks = [
    {
      title: "Derma E",
      subtitle: "Tea Tree & Vitamin E Antiseptic Cream",
      price: "₹5.20",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_1,
    },
    {
      title: "Chest-eaze",
      subtitle: "Bronchodilator & Expectorant 100ml Syrup",
      price: "₹5.20",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_2,
    },
    {
      title: "Zincovit",
      subtitle: "Multivitamin & Multimineral Supplement",
      price: "₹9.99",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_3,
    },
  ];

  return (
    <View className="mb-10">
      <View className="flex-row justify-between items-center mb-4 px-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          Top Picks for You
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600 text-sm font-lexend-bold">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {topPicks.map((item, index) => (
          <View key={index} className="w-48 bg-white rounded-2xl p-3 mr-4">
            <Image
              source={item.image}
              className="w-full h-24 mb-3"
              resizeMode="contain"
            />

            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-lexend-bold text-black">{item.title}</Text>
              <Text className="text-sm font-lexend-bold text-black">{item.price}</Text>
            </View>

            <Text className="text-xs text-gray-500 mb-3 leading-tight">
              {item.subtitle}
            </Text>

            <TouchableOpacity className="bg-brand-background flex-row items-center justify-center rounded-lg py-1">
              <Ionicons name="add" size={16} color="#E55150" />
              <Text className="text-brand-primary text-sm font-lexend-semibold ml-1">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopPicksSection;
