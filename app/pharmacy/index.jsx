import { View, Pressable, Text, TouchableOpacity } from "react-native";
import {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import Header from "@/components/common/Header";
import ROUTE_PATH from "@/routes/route.constants";
import BestSellerPharmacy from "@/components/screens/pharmacy/BestSellerPharmacy";
import TopPicksPharmacy from "@/components/screens/pharmacy/TopPicksPharmacy";
import Animated from "react-native-reanimated";
import AppHomeCarousel from "@/components/common/AppHomeCarousel";
import AppCategories from "@/components/common/AppCategories";
import AppSpecialOffer from "@/components/common/AppSpecialOffer";
import { useUserLocation } from "@/contexts/LocationContext";
import { useEffect } from "react";

const HEADER_HEIGHT = 220;

const FloatingMiniHeader = ({ scrollY, cartCount }) => {
  const router = useRouter();

  const {
    location,
    loading: locationLoading,
    fetchCurrentLocation,
    setLocation,
  } = useUserLocation();

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [30, 80], [0, 1], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [30, 80],
      [-HEADER_HEIGHT + 10, 0],
      "clamp"
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Fetch current location only on mount (if not already set)
  useEffect(() => {
    if (!location) {
      fetchCurrentLocation();
    }
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyle,
        { position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 },
      ]}
    >
      <View className="bg-brand-primary rounded-xl">
        <View className="flex-row items-center justify-between rounded-xl px-4 py-4">
          <Pressable
            onPress={() => router.push(ROUTE_PATH.APP.SEARCH.INDEX)}
            className="flex-1 mr-3 flex-row items-center bg-gray-100 px-3 py-3 rounded-xl"
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#6E6A7C" />
            <Text className="ml-2 text-sm text-gray-500 font-lexend">
              Search
            </Text>
          </Pressable>

          <TouchableOpacity
            onPress={() => router.push(ROUTE_PATH.APP.CART.INDEX)}
            className="relative"
          >
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color="white"
            />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-brand-primary rounded-full px-1.5">
                <Text className="text-white text-xs font-lexend-bold">
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-5 mt-1">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center flex-shrink pr-2"
              onPress={() =>
                router.push({
                  pathname: ROUTE_PATH.APP.SELECT_LOCATION.INDEX,
                })
              }
            >
              <Ionicons name="location" size={16} color="white" />
              <View className="ml-2 flex-row items-center flex-shrink">
                <Text className="text-sm text-text-inverse font-lexend">
                  Deliver to
                </Text>
                <Text
                  className="text-sm text-text-inverse font-lexend-bold mx-1 underline"
                  numberOfLines={1}
                >
                  {locationLoading
                    ? "Locating..."
                    : `${location?.city}, ${location?.postalCode}`}
                </Text>
                <Ionicons name="chevron-down" size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
      style={[
        {
          height: HEADER_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
        },
        animatedStyle,
      ]}
    >
      <Header />
    </Animated.View>
  );
};

const PharmacyHome = () => {
  const scrollY = useSharedValue(0);
  const cartCount = 2;

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
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 20,
          paddingBottom: 100,
        }}
      >
        <AppHomeCarousel />
        {/* <AppCategories /> */}
        <BestSellerPharmacy />
        <AppSpecialOffer />
        <TopPicksPharmacy />
      </Animated.ScrollView>

      <FloatingMiniHeader scrollY={scrollY} cartCount={cartCount} />
    </AppLayout>
  );
};

export default PharmacyHome;
