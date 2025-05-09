import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import STATIC from "@/utils/constants";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";

const BestSellerPharmacy = () => {
  const router = useRouter();

  const bestSellers = [
    {
      id: 1,
      title: "Vitamin D -3 250gm",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_2,
      rating: 5,
      price: 212.0,
      mrp: 235.0,
      manufacturer: "Loren Ipsum Pharmaceutical Industries LTD",
    },
    {
      id: 2,
      title: "Omega 3 Softgels",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_1,
      rating: 4.5,
      price: 299.0,
      mrp: 349.0,
      manufacturer: "HeartHealth Pharma Limited",
    },
    {
      id: 3,
      title: "Zincovit Tablets for Strong Immunity & Wellness",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_3,
      rating: 4.8,
      price: 150.0,
      mrp: 180.0,
      manufacturer: "Wellness Labs",
    },
  ];

  const handlePress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

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
        {bestSellers.map((item) => (
          <PharmacyProductCard key={item.id} item={item} onPress={handlePress} />
        ))}
      </ScrollView>
    </View>
  );
};

export default BestSellerPharmacy;
