import { View, Pressable, Text, TouchableOpacity } from "react-native";
import {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import AppLayout from "@/components/layouts/AppLayout";
import Header from "@/components/common/Header";
import ROUTE_PATH from "@/routes/route.constants";
import CategoriesPharmacy from "@/components/screens/pharmacy/CategoriesPharmacy";
import BestSellerPharmacy from "@/components/screens/pharmacy/BestSellerPharmacy";
import SpecialOfferPharmacy from "@/components/screens/pharmacy/SpecialOfferPharmacy";
import TopPicksPharmacy from "@/components/screens/pharmacy/TopPicksPharmacy";
import HomePromoCarouselPharmacy from "@/components/screens/pharmacy/HomePromoCarouselPharmacy";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const HEADER_HEIGHT = 220;

const FloatingMiniHeader = ({ scrollY, cartCount }) => {
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [30, 80], [0, 1], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [30, 80],
      [-HEADER_HEIGHT, 0],
      "clamp"
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute top-[-10] left-0 right-0 z-50 bg-white rounded-xl"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <BlurView
        intensity={100}
        className="px-4 py-4 flex-row items-center justify-between rounded-xl"
      >
        <Pressable
          onPress={() => router.push(ROUTE_PATH.APP.SEARCH.INDEX)}
          className="flex-1 mr-3 flex-row items-center bg-gray-100 px-3 py-3 rounded-xl"
        >
          <Ionicons name="search" size={18} color="#6E6A7C" />
          <Text className="ml-2 text-sm text-gray-500 font-lexend">Search</Text>
        </Pressable>

        <TouchableOpacity
          onPress={() => router.push(ROUTE_PATH.APP.CART.INDEX)}
          className="relative"
        >
          <Ionicons name="cart" size={24} color="#6E6A7C" />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full px-1.5">
              <Text className="text-white text-xs font-bold">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

const SlidingHeader = ({ scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 60], [1, 0], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [0, 60],
      [0, -HEADER_HEIGHT],
      "clamp"
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute top-0 left-0 right-0 z-40"
    >
      <Header />
    </Animated.View>
  );
};

const PharmacyHome = () => {
  const scrollY = useSharedValue(0);
  const cartCount = 2; // Replace with your dynamic value

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <AppLayout scroll={false}>
      <SlidingHeader scrollY={scrollY} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      >
        <HomePromoCarouselPharmacy />
        <CategoriesPharmacy />
        <BestSellerPharmacy />
        <SpecialOfferPharmacy />
        <TopPicksPharmacy />
      </Animated.ScrollView>

      <FloatingMiniHeader scrollY={scrollY} cartCount={cartCount} />
    </AppLayout>
  );
};

export default PharmacyHome;
