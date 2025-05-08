import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import AppLayout from "@/components/layouts/AppLayout";
import STATIC from "@/utils/constants";

const { width: screenWidth } = Dimensions.get("window");

const PharmacyProductDetails = () => {
  const navigation = useNavigation();
  const { productId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Description");

  const product = {
    id: 1,
    title: "Vitamin D -3 250gm",
    images: [
      STATIC.IMAGES.COMPONENTS.MEDICINE_1,
      STATIC.IMAGES.COMPONENTS.MEDICINE_2,
      STATIC.IMAGES.COMPONENTS.MEDICINE_3,
    ],
    price: 212.0,
    mrp: 235.0,
    rating: 5,
    manufacturer: "Loren Ipsum Pharmaceutical Industries LTD",
    description: "This is a high-quality Vitamin D supplement for daily use.",
    keyBenefits: "Supports bone health, immune function, and mood.",
    howToUse: "Take one capsule daily after a meal.",
    precaution: "Consult your doctor before use if pregnant or nursing.",
  };

  const tabs = ["Description", "Key Benefits", "How to Use", "Precaution"];

  return (
    <AppLayout>
      <View className="px-4 py-2 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={STATIC.IMAGES.APP.LOGO}
          className="h-6 w-24"
          resizeMode="contain"
        />
        <View className="flex-row gap-4">
          <Ionicons name="search" size={20} color="black" />
          <Ionicons name="cart" size={20} color="black" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Image Carousel */}
        <View className="mt-4">
          <Carousel
            loop
            width={screenWidth}
            height={200}
            autoPlay
            data={product.images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={item}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}
          />
        </View>

        {/* Basic Info */}
        <View className="mt-4 px-4">
          <Text className="text-xl font-bold text-text-primary mb-1">
            {product.title}
          </Text>
          <Text className="text-xs text-text-muted">
            By {product.manufacturer}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="ml-1 text-sm text-text-muted">
              {product.rating} Rating
            </Text>
          </View>
        </View>

        {/* Price Section */}
        <View className="mt-4 px-4">
          <Text className="text-2xl font-bold text-text-primary">
            ₹{product.price.toFixed(2)}
          </Text>
          <Text className="text-sm line-through text-text-muted">
            MRP ₹{product.mrp.toFixed(2)}
          </Text>
          <Text className="text-green-600 text-xs">
            Save ₹{(product.mrp - product.price).toFixed(0)}
          </Text>
        </View>

        {/* Tabs */}
        <View className="mt-6 px-4">
          <View className="flex-row gap-3 mb-2">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full ${
                  activeTab === tab ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeTab === tab ? "text-white" : "text-gray-800"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-sm text-text-primary leading-relaxed">
            {activeTab === "Description" && product.description}
            {activeTab === "Key Benefits" && product.keyBenefits}
            {activeTab === "How to Use" && product.howToUse}
            {activeTab === "Precaution" && product.precaution}
          </Text>
        </View>

        {/* Similar Products */}
        <View className="mt-6 px-4 mb-10">
          <Text className="text-lg font-bold text-text-primary mb-2">
            Similar Products
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((_, index) => (
              <View
                key={index}
                className="bg-white rounded-2xl p-3 w-40 mr-4 border border-gray-200"
              >
                <Image
                  source={STATIC.IMAGES.COMPONENTS.MEDICINE_1}
                  className="w-full h-24 mb-2"
                  resizeMode="contain"
                />
                <Text
                  className="text-sm font-semibold text-text-primary mb-1"
                  numberOfLines={1}
                >
                  Sample Product
                </Text>
                <Text className="text-xs text-text-muted">₹200.00</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default PharmacyProductDetails;
