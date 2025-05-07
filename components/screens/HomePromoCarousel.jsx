import STATIC from "@/utils/constants";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, Platform } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.99;
const SPACING = 12;

const promoBanners = [
  {
    title: "15% Off",
    subtitle: "Medicine at your doorstep",
    buttonText: "Shop Now",
    bgColor: "#EF4C47",
    image: STATIC.IMAGES.COMPONENTS.PROMO,
  },
  {
    title: "25% Off",
    subtitle: "On First Order",
    buttonText: "Explore",
    bgColor: "#E2AD5F",
    image: STATIC.IMAGES.COMPONENTS.PROMO,
  },
];

const HomePromoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="mb-6">
      <Carousel
        loop
        autoPlay
        width={CARD_WIDTH}
        height={180}
        data={promoBanners}
        scrollAnimationDuration={800}
        autoPlayInterval={4000}
        mode="parallax"
        snapEnabled
        pagingEnabled
        onSnapToItem={setActiveIndex}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
          parallaxAdjacentItemScale: 0.85,
        }}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        style={{ alignSelf: "center" }}
        renderItem={({ item }) => (
          <View
            className="p-5 rounded-2xl w-full flex-row justify-between items-center"
            style={{
              backgroundColor: item.bgColor,
              width: CARD_WIDTH - SPACING,
              marginRight: SPACING,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 10,
                },
                android: {
                  elevation: 5,
                },
              }),
            }}
          >
            {/* Text Block */}
            <View className="flex-1">
              <Text className="text-white font-bold text-2xl mb-1">
                {item.title}
              </Text>
              <Text className="text-white text-sm mb-3">{item.subtitle}</Text>
              <TouchableOpacity className="bg-[#FFE5D0] rounded-full px-4 py-2 self-start">
                <Text className="text-[#EF4C47] font-semibold text-sm">
                  {item.buttonText}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image */}
            <Image
              source={item.image}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center mt-3">
        {promoBanners.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full mx-1 ${
              i === activeIndex
                ? "w-5 bg-[#EF4C47]"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default HomePromoCarousel;
