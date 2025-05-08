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
import { Ionicons, Feather } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import Carousel from "react-native-reanimated-carousel";
import STATIC from "@/utils/constants";

const { width } = Dimensions.get("window");

const product = {
  id: 1,
  title: "Vitamin D-3 250gm",
  images: [
    STATIC.IMAGES.COMPONENTS.MEDICINE_2,
    STATIC.IMAGES.COMPONENTS.MEDICINE_1,
    STATIC.IMAGES.COMPONENTS.MEDICINE_3,
  ],
  rating: 4.8,
  price: 212,
  mrp: 235,
  manufacturer: "Loren Ipsum Pharmaceutical Industries LTD",
  description:
    "Vitamin D-3 helps support strong bones and immunity. It is a fat-soluble vitamin that your body uses to absorb calcium and phosphorus.",
  benefits: [
    "Supports strong bones",
    "Boosts immunity",
    "Helps calcium absorption",
  ],
  usage: "Take 1 tablet daily with meals or as directed by your physician.",
  precautions: [
    "Consult your doctor before use.",
    "Store in a cool dry place.",
    "Keep out of reach of children.",
  ],
};

const tabs = ["Description", "Key Benefits", "How to Use", "Precaution"];

export default function PharmacyProductDetails() {
  const { productId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Text className="text-sm text-text-secondary">
            {product.description}
          </Text>
        );
      case 1:
        return product.benefits.map((item, i) => (
          <Text key={i} className="text-sm text-text-secondary mb-1">
            • {item}
          </Text>
        ));
      case 2:
        return (
          <Text className="text-sm text-text-secondary">{product.usage}</Text>
        );
      case 3:
        return product.precautions.map((item, i) => (
          <Text key={i} className="text-sm text-text-secondary mb-1">
            • {item}
          </Text>
        ));
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Image
          source={STATIC.IMAGES.APP.LOGO}
          className="w-24 h-6"
          resizeMode="contain"
        />
        <View className="flex-row space-x-4">
          <TouchableOpacity>
            <Feather name="search" size={20} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="cart-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Image Carousel */}
        <View className="my-4">
          <Carousel
            loop
            width={width}
            height={240}
            autoPlay={false}
            data={product.images}
            scrollAnimationDuration={500}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={({ item }) => (
              <Image
                source={item}
                className="w-full h-56 rounded-xl"
                resizeMode="contain"
              />
            )}
          />
          <View className="flex-row justify-center mt-2">
            {product.images.map((_, i) => (
              <View
                key={i}
                className={`w-2 h-2 rounded-full mx-1 ${
                  i === activeSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Basic Info */}
        <View className="px-4 mb-3">
          <Text className="text-xl font-bold text-text-primary">
            {product.title}
          </Text>
          <Text className="text-sm text-text-muted">
            By {product.manufacturer}
          </Text>
        </View>

        {/* Price Info */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-text-primary">
            ₹{product.price}
          </Text>
          <Text className="text-sm text-text-muted line-through">
            MRP ₹{product.mrp}
          </Text>
          <Text className="text-xs text-green-600">
            Save ₹{(product.mrp - product.price).toFixed(0)}
          </Text>
        </View>

        {/* Tabs */}
        <View className="px-4">
          <View className="flex-row mb-3">
            {tabs.map((tab, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveTab(i)}
                className={`mr-3 pb-1 border-b-2 ${
                  i === activeTab ? "border-blue-600" : "border-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    i === activeTab ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View>{renderTabContent()}</View>
        </View>

        {/* Similar Products */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-bold mb-2">Similar Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(3).keys()].map((_, index) => (
              <TouchableOpacity
                key={index}
                className="mr-4 w-36 bg-white rounded-xl p-2 shadow-sm"
              >
                <Image
                  source={STATIC.IMAGES.COMPONENTS.MEDICINE_1}
                  className="h-20 w-full"
                  resizeMode="contain"
                />
                <Text
                  numberOfLines={2}
                  className="text-xs font-semibold text-text-primary mt-1"
                >
                  Similar Product {index + 1}
                </Text>
                <Text className="text-xs text-gray-500">₹199.00</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="h-12" />
      </ScrollView>
    </AppLayout>
  );
}
