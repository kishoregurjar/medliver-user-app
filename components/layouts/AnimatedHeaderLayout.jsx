// components/layouts/AnimatedHeaderLayout.js
import React, { useEffect } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useUserLocation } from "@/contexts/LocationContext";
import AppLayout from "@/components/layouts/AppLayout";
import Header from "@/components/common/Header";
import ROUTE_PATH from "@/routes/route.constants";

const HEADER_HEIGHT = 220;

const SlidingHeader = ({ scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 60], [1, 0], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [0, 60],
      [0, -HEADER_HEIGHT],
      "clamp"
    );
    return { opacity, transform: [{ translateY }] };
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

const FloatingMiniHeader = ({ scrollY }) => {
  const router = useRouter();
  const {
    location,
    loading: locationLoading,
    fetchCurrentLocation,
  } = useUserLocation();

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [30, 80], [0, 1], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [30, 80],
      [-HEADER_HEIGHT + 10, 0],
      "clamp"
    );
    return { opacity, transform: [{ translateY }] };
  });

  useEffect(() => {
    if (!location) fetchCurrentLocation();
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
            {/* {cartCount && cartCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-brand-primary rounded-full px-1.5">
                <Text className="text-white text-xs font-lexend-bold">
                  {cartCount}
                </Text>
              </View>
            )} */}
          </TouchableOpacity>
        </View>
        <View className="px-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center flex-shrink pr-2 mb-5 mt-1"
            onPress={() =>
              router.push({ pathname: ROUTE_PATH.APP.SELECT_LOCATION.INDEX })
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
    </Animated.View>
  );
};

export default function AnimatedHeaderLayout({ children }) {
  const scrollY = useSharedValue(0);
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
        {typeof children === "function" ? children(scrollY) : children}
      </Animated.ScrollView>
      <FloatingMiniHeader scrollY={scrollY} />
    </AppLayout>
  );
}
