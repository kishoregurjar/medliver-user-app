import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import STATIC from "@/utils/constants";

const BestSellerSection = () => {
  const bestSellers = [
    {
      title: "Vitamin D -3 250gm",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_2,
      rating: 5,
      tags: ["Treatment", "Supplement"],
      price: 212.0,
      mrp: 235.0,
      manufacturer: "Loren Ipsum Pharmaceutical Industries LTD",
    },
    {
      title: "Omega 3 Softgels",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_1,
      rating: 4.5,
      tags: ["Heart", "Supplement", "Cardio"],
      price: 299.0,
      mrp: 349.0,
      manufacturer: "HeartHealth Pharma Limited",
    },
    {
      title: "Zincovit Tablets for Strong Immunity & Wellness",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_3,
      rating: 4.8,
      tags: ["Immunity", "Vitamins", "Daily Health", "Zinc"],
      price: 150.0,
      mrp: 180.0,
      manufacturer: "Wellness Labs",
    },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          Best Seller Products
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600 text-sm font-lexend-bold">See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-1">
        {bestSellers.map((item, index) => {
          const discount = item.mrp - item.price;

          return (
            <View key={index} className="bg-white rounded-2xl p-3 w-52 mr-4">
              {/* Image */}
              <Image
                source={item.image}
                className="w-full h-24 mb-3"
                resizeMode="contain"
              />

              {/* Rating */}
              <View className="flex-row items-center mb-1 border border-gray-200 rounded-full px-2 py-0.5 w-fit self-start">
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text className="text-xs text-[#6E6A7C] ml-1">{item.rating}</Text>
              </View>

              {/* Title */}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-semibold text-sm text-[#222] leading-tight mb-1"
              >
                {item.title}
              </Text>

              {/* Price */}
              <Text className="text-[#1E1E1E] text-sm font-bold">
                ₹{item.price.toFixed(2)}
              </Text>
              <Text className="text-xs text-gray-400 line-through">
                MRP ₹{item.mrp.toFixed(2)}
              </Text>
              <Text className="text-[10px] text-green-600 mb-1">
                Save ₹{discount.toFixed(0)}
              </Text>

              {/* Manufacturer */}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-[10px] text-gray-400 leading-tight mb-2"
              >
                By {item.manufacturer}
              </Text>

              {/* Add to Cart */}
              <TouchableOpacity className="flex-row items-center justify-center rounded-lg py-1">
                <Ionicons name="add" size={16} color="#E2AD5F" />
                <Text className="text-brand-secondary text-sm font-lexend-semibold ml-1">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BestSellerSection;
