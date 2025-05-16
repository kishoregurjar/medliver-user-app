import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import SkeletonPharmacyCarouselCard from "@/components/skeletons/SkeletonPharmacyCarouselCard";

const { width } = Dimensions.get("window");
const SPACING = 12;
const CARD_WIDTH = width * 0.99 - SPACING * 2;

const SpecialOfferPharmacy = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const {
    request: fetchSpecialOffers,
    loading: isLoading,
    error: hasError,
  } = useAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      const { data, error } = await fetchSpecialOffers({
        method: "GET",
        url: "/user/get-all-special-offer?page=1",
      });
      if (error) {
        console.error("Error fetching special offers:", error);
        return;
      }
      if (data?.data?.specialOffers) {
        setProducts(data.data.specialOffers);
      }
    };

    fetchOffers();
  }, []);

  const handlePress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  const bgColors = [
    "bg-brand-primary/80",
    "bg-accent-royalBlue",
    "bg-accent-maroon",
    "bg-brand-secondary",
    "bg-accent-softIndigo",
    "bg-accent-indigo",
    "bg-accent-pink",
    ];

  return (
    <View className="mb-6">
      {/* Heading */}
      <Text className="text-lg font-lexend-bold text-text-primary mb-4">
        Special Offers
      </Text>

      {isLoading ? (
        <SkeletonPharmacyCarouselCard />
      ) : products.length === 0 ? (
        <View className="h-28 justify-center px-4">
          <Text className="text-gray-400 text-sm font-lexend-medium">
            No Offers Available
          </Text>
        </View>
      ) : (
        <>
          {/* Carousel */}
          <Carousel
            loop
            autoPlay
            width={width}
            height={160}
            data={products}
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
            renderItem={({ item, index }) => {
              const bgColor = bgColors[index % bgColors.length];

              return (
                <TouchableOpacity
                  onPress={() => handlePress(item.product?._id)}
                  activeOpacity={0.9}
                  className={`p-5 rounded-2xl flex-row justify-between items-center ${bgColor}`}
                  style={{ width: CARD_WIDTH }}
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-lexend-bold text-lg mb-1">
                      {item.product?.name ?? "Unnamed Product"}
                    </Text>
                    <Text className="text-white/70 line-through text-sm">
                      ₹{item.originalPrice?.toFixed(2)}
                    </Text>
                    <Text className="text-white font-lexend-bold text-xl">
                      ₹{item.offerPrice?.toFixed(2)}
                    </Text>
                    <Text className="text-white text-xs">
                      {item.offerPercentage}% Off
                    </Text>
                    <View className="bg-white rounded-full px-3 py-1 mt-2 self-start">
                      <Text className="text-brand-primary font-lexend-medium text-sm">
                        Buy Now
                      </Text>
                    </View>
                  </View>

                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("@/assets/logos/logo.png")
                    }
                    className="w-24 h-24"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            }}
          />

          {/* Dot Indicators */}
          <View className="flex-row justify-center mt-3">
            {products.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full mx-1 ${
                  i === activeIndex ? "w-5 bg-brand-primary" : "w-2 bg-gray-400"
                }`}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default SpecialOfferPharmacy;
