import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import STATIC from "@/utils/constants";
import GradientBackground from "@/components/common/GradientEllipse";
import Header from "@/components/common/Header";
import useAxios from "@/hooks/useAxios";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const promoBanners = [
  {
    title: "15% Off",
    subtitle: "Medicine at your doorstep",
    buttonText: "Shop Now",
    bgColor: "#EF4C47",
  },
  {
    title: "25% Off",
    subtitle: "On First Order",
    buttonText: "Explore",
    bgColor: "#007AFF",
  },
];

const PharmacyHome = () => {
  const categories = [
    { label: "Medicine", icon: "medkit-outline" },
    { label: "Hospital", icon: "business-outline" },
    { label: "Pathology", icon: "flask-outline" },
  ];

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
  ];
  const bestSellers = [1, 2, 3];

  const { request: getAllSpecialOffer } = useAxios();
  const { request: getTopPicks } = useAxios();
  const { request: getBestSellers } = useAxios();

  useEffect(() => {
    const getAllSpecialOfferData = async () => {
      const { data, error } = await getAllSpecialOffer({
        method: "GET",
        url: "/user/get-all-special-offer?page=1",
      });

      console.log(data, error);
    };

    const getAllFeatureProductData = async () => {
      const { data, error } = await getTopPicks({
        method: "GET",
        url: "/user/get-all-feature-product?page=1",
      });

      console.log(data, error);
    };

    const getBestSellersData = async () => {
      const { data, error } = await getBestSellers({
        method: "GET",
        url: "/user/get-all-selling-product?limit=2&page=1&sortOrder=asc",
      });

      console.log(data, error);
    };

    getAllSpecialOfferData();
    getBestSellersData();
    getAllFeatureProductData();
  }, []);

  return (
    <GradientBackground
      animateBlobs
      darkMode={false}
      animationType="pulse"
      animationSpeed={1000}
    >
      <SafeAreaView className="flex-1">
        <StatusBar style="dark" />
        <ScrollView showsVerticalScrollIndicator={false} className="px-4 pt-2">
          {/* Header */}
          <Header />

          {/* Promo Banner */}
          <Carousel
            loop
            width={width}
            height={140}
            autoPlay
            pagingEnabled={false}
            snapEnabled
            mode="parallax"
            data={promoBanners}
            scrollAnimationDuration={1000}
            style={{ marginBottom: 24 }}
            renderItem={({ item }) => (
              <View
                className="w-[95%] mr-4 p-6 rounded-2xl"
                style={{
                  backgroundColor: item.bgColor,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 10,
                  elevation: 4,
                }}
              >
                <Text className="text-white font-bold text-xl mb-1">
                  {item.title}
                </Text>
                <Text className="text-white mb-3">{item.subtitle}</Text>
                <TouchableOpacity className="bg-[#FFE5D0] rounded-full px-4 py-2 self-start">
                  <Text className="text-[#EF4C47] font-semibold">
                    {item.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Categories */}
          <View className="flex-row flex-wrap gap-3">
            {categories.map((cat, i) => (
              <TouchableOpacity
                key={i}
                className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm"
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color="#6E6A7C"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-[#6E6A7C] text-sm font-medium">
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Best Seller */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold">Best Seller Products</Text>
              <TouchableOpacity>
                <Text className="text-blue-600">See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-4"
            >
              {bestSellers.map((item) => (
                <View
                  key={item}
                  className="w-40 bg-white rounded-xl shadow-sm p-3 mr-3"
                >
                  <Image
                    source={STATIC.IMAGES.COMPONENTS.MEDICINE_2}
                    className="w-full h-24 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="font-medium text-sm mb-1">
                    Vitamin D -3 250gm
                  </Text>
                  <Text className="text-xs text-gray-500">$212.00</Text>
                  <TouchableOpacity className="mt-2 bg-[#EF4C47] rounded-md py-1">
                    <Text className="text-white text-center text-sm">
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Special Offer */}
          <View className="bg-[#EF4C47] p-4 rounded-2xl mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-lg">Baby Organix</Text>
              <Text className="line-through text-white/60">$20</Text>
              <Text className="text-white text-xl font-bold">10$</Text>
              <Text className="text-white text-xs">15% Off</Text>
              <TouchableOpacity className="bg-[#FFE5D0] rounded-full px-3 py-1 mt-2">
                <Text className="text-[#EF4C47] font-medium">Buy Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={STATIC.IMAGES.APP.LOGO}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          {/* Top Picks */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold">Top Picks for You</Text>
              <TouchableOpacity>
                <Text className="text-blue-600">See All</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {topPicks.map((item, index) => (
                <View
                  key={index}
                  className="w-[48%] bg-white rounded-xl shadow-sm p-3 mb-4"
                >
                  <Image
                    source={item.image}
                    className="w-full h-20 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="font-bold text-sm">{item.title}</Text>
                  <Text className="text-xs text-gray-600 mb-1">
                    {item.subtitle}
                  </Text>
                  <Text className="font-semibold mb-2">{item.price}</Text>
                  <View className="flex-row justify-between">
                    <TouchableOpacity className="border border-[#EF4C47] rounded px-2 py-1">
                      <Text className="text-xs text-[#EF4C47]">
                        View Detail
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#EF4C47] rounded px-2 py-1">
                      <Text className="text-xs text-white">Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default PharmacyHome;
