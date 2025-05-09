import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
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

const TopPicksPharmacy = () => {
  const topPicks = [
    {
      id: 1,
      title: "Derma E",
      subtitle: "Tea Tree & Vitamin E Antiseptic Cream",
      price: "₹5.20",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_1,
    },
    {
      id: 2,
      title: "Chest-eaze",
      subtitle: "Bronchodilator & Expectorant 100ml Syrup",
      price: "₹5.20",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_2,
    },
    {
      id: 3,
      title: "Zincovit",
      subtitle: "Multivitamin & Multimineral Supplement",
      price: "₹9.99",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_3,
    },
  ];

  const handlePress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };


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

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {topPicks.map((item, index) => (
          <PharmacyProductCard
            type="small"
            key={item.id}
            item={item}
            onPress={handlePress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TopPicksPharmacy;
