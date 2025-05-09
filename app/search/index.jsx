import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import STATIC from "@/utils/constants";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";

export default function SearchMedicineScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const categories = [
    "Pain Relief",
    "Cough & Cold",
    "Vitamins",
    "Diabetes",
    "Heart Care",
  ];

  const featuredProducts = [
    {
      id: 1,
      title: "Vitamin D-3 250gm",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_2,
      rating: 4.8,
      price: 212,
      mrp: 235,
      manufacturer: "Loren Ipsum Pharma",
    },
    {
      id: 2,
      title: "Cough Syrup",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_1,
      rating: 4.2,
      price: 130,
      mrp: 150,
      manufacturer: "ColdFix Pharma",
    },
    {
      id: 3,
      title: "Paracetamol Tablets",
      image: STATIC.IMAGES.COMPONENTS.MEDICINE_3,
      rating: 4.5,
      price: 50,
      mrp: 60,
      manufacturer: "Medico Labs",
    },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack
        showBackButton
        title="Search Medicines"
        clearStack
        backTo="/home"
      />

      {/* Body */}
      <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
        {/* Search Field */}
        <View className="flex-row items-center bg-white border border-background-soft px-4 py-3 rounded-xl mb-6">
          <Ionicons name="search" size={20} color="#888" className="mr-2" />
          <TextInput
            className="flex-1 text-base"
            placeholder="Search for medicines"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className="bg-brand-primary/10 border border-brand-primary/90 px-4 py-2 rounded-full mr-3"
                onPress={() =>
                  router.push({
                    pathname: "/pharmacy",
                    params: { query: category },
                  })
                }
              >
                <Text className="text-brand-primary text-sm font-lexend-medium">
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View className="mb-6">
          <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
            Featured Products
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.map((item) => (
              <PharmacyProductCard
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/pharmacy/product/[productId]",
                    params: { productId: item.id },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        <View className="h-6" />
      </ScrollView>
    </AppLayout>
  );
}
