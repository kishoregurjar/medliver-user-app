import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import SkeletonPharmacyCarouselCard from "@/components/skeletons/SkeletonPharmacyCarouselCard";
import STATIC from "@/utils/constants";

const { width } = Dimensions.get("window");

const CARD_WIDTH = 100 * (width / 100) - 20; // 100px width minus 20px for spacing
const SPACING = 10;

const staticOffers = [
  {
    title: "Complete Blood Count (CBC)",
    originalPrice: "₹500",
    offerPrice: "₹299",
    discount: "Save 40%",
    buttonText: "Book Now",
    image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    bgClass: "bg-brand-primary/80",
  },
  {
    title: "Liver Function Test (LFT)",
    originalPrice: "₹800",
    offerPrice: "₹599",
    discount: "Save 25%",
    buttonText: "Book Now",
    image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    bgClass: "bg-brand-secondary",
  },
  {
    title: "Thyroid Profile - T3 T4 TSH",
    originalPrice: "₹650",
    offerPrice: "₹450",
    discount: "Save 30%",
    buttonText: "Book Now",
    image: STATIC.IMAGES.COMPONENTS.PROMO_PATHOLOGY,
    bgClass: "bg-accent-softIndigo",
  },
];

const bgColors = [
  "bg-brand-primary/80",
  "bg-accent-royalBlue",
  "bg-accent-maroon",
  "bg-brand-secondary",
  "bg-accent-softIndigo",
  "bg-accent-indigo",
  "bg-accent-pink",
];

const AppSpecialOffer = ({ type = "pharmacy" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const { request: fetchSpecialOffers, loading: isLoading } = useAxios();
  const router = useRouter();

  const isPathology = type === "pathology";

  useEffect(() => {
    if (isPathology) {
      setOffers(staticOffers);
    } else {
      const fetchOffers = async () => {
        const { data, error } = await fetchSpecialOffers({
          method: "GET",
          url: "/user/get-all-special-offer?page=1",
        });
        if (!error && data?.data?.specialOffers) {
          setOffers(data.data.specialOffers);
        }
      };
      fetchOffers();
    }
  }, [type]);

  const handlePharmacyPress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-lexend-bold text-text-primary mb-4">
        Special Offers{isPathology ? " on Lab Tests" : ""}
      </Text>

      {isPathology ? null : isLoading ? (
        <SkeletonPharmacyCarouselCard />
      ) : offers.length === 0 ? (
        <View className="h-28 justify-center px-4">
          <Text className="text-gray-400 text-sm font-lexend-medium">
            No Offers Available
          </Text>
        </View>
      ) : null}

      {!isPathology && (isLoading || offers.length === 0) ? null : (
        <>
          <Carousel
            loop
            autoPlay
            width={width}
            height={160}
            data={offers}
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
              const bgClass = isPathology
                ? item.bgClass
                : bgColors[index % bgColors.length];

              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    isPathology ? null : handlePharmacyPress(item.product?._id)
                  }
                  className={`p-5 rounded-2xl flex-row justify-between items-center ${bgClass}`}
                  style={{
                    width: CARD_WIDTH - SPACING,
                    marginRight: SPACING,
                  }}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className="text-white font-lexend-bold text-lg mb-1"
                      numberOfLines={1}
                    >
                      {isPathology
                        ? item.title
                        : item.product?.name ?? "Unnamed Product"}
                    </Text>
                    <Text className="text-white/70 line-through text-sm">
                      {isPathology
                        ? item.originalPrice
                        : `₹${item.originalPrice?.toFixed(2)}`}
                    </Text>
                    <Text className="text-white font-lexend-bold text-xl">
                      {isPathology
                        ? item.offerPrice
                        : `₹${item.offerPrice?.toFixed(2)}`}
                    </Text>
                    <Text className="text-white text-xs">
                      {isPathology
                        ? item.discount
                        : `${item.offerPercentage}% Off`}
                    </Text>
                    <View className="bg-white rounded-full px-3 py-1 mt-2 self-start">
                      <Text className="text-brand-primary font-lexend-medium text-sm">
                        {isPathology ? item.buttonText : "Buy Now"}
                      </Text>
                    </View>
                  </View>

                  <Image
                    source={
                      isPathology
                        ? item.image
                        : item.image
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

          <View className="flex-row justify-center mt-3">
            {offers.map((_, i) => (
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

export default AppSpecialOffer;
