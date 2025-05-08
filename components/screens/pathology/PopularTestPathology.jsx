import STATIC from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const PopularTestPathology = () => {
  const topTests = [
    {
      title: "CBC - Complete Blood Count",
      subtitle: "Reports in 12 Hours",
      originalPrice: "₹600",
      discountedPrice: "₹399",
      discount: "34% Off",
      image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    },
    {
      title: "Vitamin D Test",
      subtitle: "Reports in 10 Hours",
      originalPrice: "₹1000",
      discountedPrice: "₹699",
      discount: "30% Off",
      image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    },
    {
      title: "HbA1c - Diabetes",
      subtitle: "Reports in 8 Hours",
      originalPrice: "₹800",
      discountedPrice: "₹499",
      discount: "38% Off",
      image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    },
  ];

  return (
    <View className="mb-10">
      <View className="flex-row justify-between items-center mb-4 px-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          Popular Lab Tests
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
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {topTests.map((item, index) => (
          <View
            key={index}
            className="w-48 bg-white rounded-2xl p-3 mr-4 border border-background-soft shadow-sm"
          >
            <Image
              source={item.image}
              className="w-full h-24 mb-2"
              resizeMode="contain"
            />

            <Text
              className="text-sm font-lexend-bold text-black mb-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>

            <Text
              className="text-xs text-gray-500 mb-2 leading-tight"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.subtitle}
            </Text>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xs text-gray-400 line-through">
                {item.originalPrice}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm font-lexend-bold text-black mr-1">
                  {item.discountedPrice}
                </Text>
                <Text className="text-xs text-green-600 font-lexend-semibold">
                  {item.discount}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-brand-primary flex-row items-center justify-center rounded-lg py-2">
              <Ionicons name="flask" size={16} color="#fff" />
              <Text className="text-white text-sm font-lexend-semibold ml-1">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PopularTestPathology;
