import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import STATIC from "@/utils/constants";

const { width } = Dimensions.get("window");
const SPACING = 12;
const CARD_WIDTH = width * 0.99 - SPACING * 2;

const specialOffers = [
  {
    title: "Baby Organix",
    originalPrice: "$20",
    offerPrice: "$10",
    discount: "15% Off",
    buttonText: "Buy Now",
    image: STATIC.IMAGES.APP.LOGO,
    className:
      "p-5 bg-brand-primary rounded-2xl flex-row justify-between items-center",
  },
  {
    title: "Natural Care Kit",
    originalPrice: "$35",
    offerPrice: "$28",
    discount: "20% Off",
    buttonText: "Buy Now",
    image: STATIC.IMAGES.APP.LOGO,
    className:
      "p-5 bg-brand-secondary rounded-2xl flex-row justify-between items-center",
  },
  {
    title: "Skin Essentials",
    originalPrice: "$50",
    offerPrice: "$39",
    discount: "22% Off",
    buttonText: "Shop Now",
    image: STATIC.IMAGES.APP.LOGO,
    className:
      "p-5 bg-accent-softIndigo rounded-2xl flex-row justify-between items-center",
  },
];

const SpecialOfferSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="mb-6">
      {/* Heading */}
      <Text className="text-lg font-lexend-bold text-text-primary mb-4">
        Special Offers
      </Text>

      {/* Carousel */}
      <Carousel
        loop
        autoPlay
        width={width}
        height={160}
        data={specialOffers}
        scrollAnimationDuration={800}
        autoPlayInterval={4000}
        snapEnabled
        pagingEnabled
        onSnapToItem={setActiveIndex}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 60,
          parallaxAdjacentItemScale: 0.85,
        }}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        style={{ alignSelf: "center" }}
        renderItem={({ item }) => (
          <View
            className={item.className}
            style={{
              width: CARD_WIDTH,
            }}
          >
            <View>
              <Text className="text-white font-lexend-bold text-lg mb-1">
                {item.title}
              </Text>
              <Text className="text-white/70 line-through text-sm">
                {item.originalPrice}
              </Text>
              <Text className="text-white font-lexend-bold text-xl">
                {item.offerPrice}
              </Text>
              <Text className="text-white text-xs">{item.discount}</Text>
              <TouchableOpacity className="bg-brand-background rounded-full px-3 py-1 mt-2 self-start">
                <Text className="text-brand-primary font-lexend-medium text-sm">
                  {item.buttonText}
                </Text>
              </TouchableOpacity>
            </View>

            <Image
              source={item.image}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center mt-3">
        {specialOffers.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full mx-1 ${
              i === activeIndex ? "w-5 bg-brand-primary" : "w-2 bg-gray-400"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default SpecialOfferSection;
