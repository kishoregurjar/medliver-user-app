import STATIC from "@/utils/constants";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.99;
const SPACING = 12;

const pathologyPromos = [
  {
    title: "Book Lab Test",
    subtitle: "Pathology tests at your doorstep",
    buttonText: "Schedule Now",
    image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY, // Replace with actual pathology image
    className:
      "p-5 bg-brand-primary rounded-2xl w-full flex-row justify-between items-center",
  },
  {
    title: "Full Body Checkup",
    subtitle: "Comprehensive Health Package",
    buttonText: "Book Today",
    image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    className:
      "p-5 bg-brand-secondary rounded-2xl w-full flex-row justify-between items-center",
  },
  {
    title: "Free Home Sample Pickup",
    subtitle: "Safe & Contactless Collection",
    buttonText: "Get Started",
    image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    className:
      "p-5 bg-accent-indigo rounded-2xl w-full flex-row justify-between items-center",
  },
];

const HomePromoCarouselPathology = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="mb-6">
      <Carousel
        loop
        autoPlay
        width={CARD_WIDTH}
        height={180}
        data={pathologyPromos}
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
            className={item.className}
            style={{
              width: CARD_WIDTH - SPACING,
              marginRight: SPACING,
            }}
          >
            {/* Text Block */}
            <View className="flex-1">
              <Text className="text-white font-lexend-bold text-2xl mb-1">
                {item.title}
              </Text>
              <Text className="text-white text-sm font-lexend mb-3">
                {item.subtitle}
              </Text>
              <TouchableOpacity className="bg-brand-background rounded-full px-4 py-2 self-start">
                <Text className="text-brand-primary font-lexend-semibold text-sm">
                  {item.buttonText}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image */}
            <Image
              source={item.image}
              className="w-40 h-40"
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center mt-1">
        {pathologyPromos.map((_, i) => (
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

export default HomePromoCarouselPathology;
