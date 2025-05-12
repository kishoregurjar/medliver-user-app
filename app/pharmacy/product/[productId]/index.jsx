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
import AppLayout from "@/components/layouts/AppLayout";
import Carousel from "react-native-reanimated-carousel";
import STATIC from "@/utils/constants";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import { formatPrice, getDiscount } from "@/utils/format";

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
  ingredients: ["Cholecalciferol (Vitamin D3)", "Gelatin", "Glycerin"],
  storage: "Store in a cool, dry place away from sunlight.",
};

const tabs = [
  "Description",
  "Key Benefits",
  "How to Use",
  "Precaution",
  "Ingredients",
];

export default function PharmacyProductDetails() {
  const { productId } = useLocalSearchParams();

  console.log("Product ID:", productId);
  
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Text className="text-sm text-text-muted">{product.description}</Text>
        );
      case 1:
        return product.benefits.map((item, i) => (
          <Text key={i} className="text-sm text-text-muted mb-1">
            • {item}
          </Text>
        ));
      case 2:
        return <Text className="text-sm text-text-muted">{product.usage}</Text>;
      case 3:
        return product.precautions.map((item, i) => (
          <Text key={i} className="text-sm text-text-muted mb-1">
            • {item}
          </Text>
        ));
      case 4:
        return product.ingredients.map((item, i) => (
          <Text key={i} className="text-sm text-text-muted mb-1">
            - {item}
          </Text>
        ));
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <HeaderWithBack showCart showNotification showSearch />

      {/* Carousel */}
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
            <Image source={item} className="w-full h-60" resizeMode="contain" />
          )}
        />
        <View className="flex-row justify-center mt-2">
          {product.images.map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${
                i === activeSlide ? "bg-brand-primary" : "bg-text-muted"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Product Info */}
      <View className="bg-white p-5 rounded-xl my-4">
        <Text className="text-xl font-lexend-semibold text-gray-900 mb-1">
          {product.title}
        </Text>
        <Text className="text-sm text-gray-500">By {product.manufacturer}</Text>
        <Text className="text-sm text-gray-500">Origin: India</Text>
      </View>

      {/* Price Info */}
      <View className="bg-brand-background p-4 rounded-xl mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-lg font-lexend-bold text-gray-900">
            {formatPrice(product.price)}
          </Text>
          <Text className="text-sm text-gray-400 line-through ml-2">
            MRP {formatPrice(product.mrp)}
          </Text>
        </View>
        <Text className="text-sm text-green-600">
          Save {formatPrice(getDiscount(product.mrp, product.price))}
        </Text>
      </View>

      {/* Product Details Tabs */}
      <View className="bg-white p-4 rounded-xl mb-4">
        <View className="flex-row border-b border-gray-200 mb-3">
          {tabs.map((tab, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveTab(i)}
              className={`mr-4 pb-2 ${
                i === activeTab
                  ? "border-b-2 border-brand-primary"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-sm ${
                  i === activeTab ? "text-brand-primary" : "text-text-muted"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderTabContent()}
      </View>

      {/* Storage Info */}
      <View className="bg-white p-4 rounded-xl mb-4">
        <Text className="text-md font-lexend-bold text-text-primary mb-1">
          Storage Instructions
        </Text>
        <Text className="text-sm text-text-muted">{product.storage}</Text>
      </View>

      {/* Similar Products */}
      <View className="mt-6 mb-8">
        <Text className="text-lg font-lexend-bold text-text-primary mb-3">
          Similar Products
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
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
              title: "Zincovit Tablets",
              image: STATIC.IMAGES.COMPONENTS.MEDICINE_3,
              rating: 4.8,
              price: 150.0,
              mrp: 180.0,
              manufacturer: "Wellness Labs",
            },
          ].map((product) => (
            <PharmacyProductCard
              key={product.id}
              item={product}
              onPress={() =>
                navigation.push({
                  pathname: "/pharmacy/product/[productId]",
                  params: { productId: product.id },
                })
              }
            />
          ))}
        </ScrollView>
      </View>
    </AppLayout>
  );
}
