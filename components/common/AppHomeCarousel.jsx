import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";

const { width } = Dimensions.get("window");

const CARD_WIDTH = 100 * (width / 100) - 20; // 100px width minus 20px for spacing
const SPACING = 15; // 10px spacing between cards

const fallbackBannerStyles = [
  {
    bgColor: "#EF4C47",
    className:
      "p-5 bg-brand-primary rounded-2xl w-full flex-row justify-between items-center",
  },
  {
    bgColor: "#E2AD5F",
    className:
      "p-5 bg-brand-secondary rounded-2xl w-full flex-row justify-between items-center",
  },
  {
    bgColor: "#4F46E5",
    className:
      "p-5 bg-accent-indigo rounded-2xl w-full flex-row justify-between items-center",
  },
];

const AppHomeCarousel = ({ type = "pharmacy" }) => {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [promoBanners, setPromoBanners] = useState([]);

  const { request: getPromoBanners, loading: isLoading } = useAxios();

  useEffect(() => {
    const fetchPromoBanners = async () => {
      let url =
        type === "pharmacy"
          ? "/user/get-all-banners?isActive=true&type=medicine"
          : type === "pathology"
          ? "/user/get-all-banners?isActive=true&type=test"
          : "/user/get-all-banners?isActive=true&type=medicine";

      const { data, error } = await getPromoBanners({
        method: "GET",
        url,
      });      

      if (!error && data?.status === 200 && Array.isArray(data.data.banners)) {
        const enhancedData = data.data.banners.map((item) => {
          const randomStyle =
            fallbackBannerStyles[
              Math.floor(Math.random() * fallbackBannerStyles.length)
            ];
          return {
            ...item,
            ...randomStyle,
          };
        });
        setPromoBanners(enhancedData);
      }
    };

    fetchPromoBanners();
  }, []);

  const handlePress = (item) => {
    if (item.path?.startsWith("/")) {
      router.push(`${item.path}`);
    } else if (item.redirectUrl?.startsWith("http")) {
      Linking.openURL(item.redirectUrl);
    }
  };

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
          <TouchableOpacity
            onPress={() => handlePress(item)}
            activeOpacity={0.9}
            className={item.className}
            style={{
              width: CARD_WIDTH - SPACING,
              marginRight: SPACING,
            }}
          >
            <View className="flex-1">
              <Text
                className="text-white font-lexend-bold text-xl mb-1"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text
                className="text-white text-xs font-lexend mb-3"
                numberOfLines={2}
              >
                {item.description}
              </Text>
              <View className="bg-white rounded-full px-4 py-1 self-start">
                <Text className="text-brand-primary font-lexend-semibold text-xs">
                  {item?.buttonText || "View Offer"}
                </Text>
              </View>
            </View>

            <Image
              source={{ uri: item.bannerImageUrl }}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center mt-2">
        {promoBanners.map((_, i) => (
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

export default AppHomeCarousel;
