import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import HeaderWithBack from "./HeaderWithBack";
import { useAuthUser } from "@/contexts/AuthContext";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import ROUTE_PATH from "@/routes/route.constants";
import { useUserLocation } from "@/contexts/LocationContext";

const { width } = Dimensions.get("window");

const Header = () => {
  const router = useRouter();
  const { authUser } = useAuthUser();
  const {
    location,
    loading: locationLoading,
    fetchCurrentLocation,
    setLocation,
  } = useUserLocation();

  const user = authUser?.user;
  const isGuest = !user;
  const userName = user?.fullName || "Guest";
  const userProfilePicture = user?.profilePicture;

  // Fetch current location only on mount (if not already set)
  useEffect(() => {
    if (!location) {
      fetchCurrentLocation();
    }
  }, []);

  return (
    <View>
      {/* Top Header */}
      <HeaderWithBack
        showCart
        showNotification
        iconNavigation={{
          search: { to: ROUTE_PATH.APP.SEARCH.INDEX, clearStack: false },
          cart: { to: ROUTE_PATH.APP.CART.INDEX, clearStack: false },
          notification: {
            to: ROUTE_PATH.APP.NOTIFICATIONS.INDEX,
            clearStack: false,
          },
        }}
      />

      {/* Location & Login Row */}
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
          <Ionicons name="location" size={16} color="#6E6A7C" />
          <View className="ml-2 flex-row items-center flex-shrink">
            <Text className="text-sm text-text-muted font-lexend">
              Deliver to
            </Text>
            <Text
              className="text-sm text-text-muted font-lexend-bold mx-1 underline"
              numberOfLines={1}
            >
              {locationLoading
                ? "Locating..."
                : `${location?.city}, ${location?.postalCode}`}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6E6A7C" />
          </View>
        </TouchableOpacity>

        {isGuest && (
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center bg-brand-primary rounded-lg px-4 py-2 ml-2"
            onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}
          >
            <Ionicons name="person" size={15} color="#fff" />
            <Text className="text-xs text-white font-lexend ml-2">Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Greeting Section */}
      <View className="flex-row items-center mb-5">
        <Avatar size="md" className="mr-3">
          {userProfilePicture ? (
            <AvatarImage source={{ uri: userProfilePicture }} />
          ) : (
            <AvatarFallbackText>
              <Text className="text-2xl font-lexend-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </AvatarFallbackText>
          )}
        </Avatar>

        <View>
          <Text className="text-lg font-lexend-bold text-black">
            {isGuest ? "Hi Guest!" : `Hi ${userName.split(" ")[0]}!`}
          </Text>
          <Text className="text-sm font-lexend text-gray-500">
            How can I help you today?
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <Pressable
        onPress={() => router.push(ROUTE_PATH.APP.SEARCH.INDEX)}
        className="flex-row items-center bg-white border border-background-soft rounded-xl px-4 py-4 mb-4"
      >
        <Ionicons name="search" size={20} color="#6E6A7C" />
        <Text className="ml-2 font-lexend text-sm text-gray-500">
          Search Medicine
        </Text>
      </Pressable>
    </View>
  );
};

export default Header;
