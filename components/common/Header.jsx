import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderWithBack from "./HeaderWithBack";
import { useAuthUser } from "@/contexts/AuthContext";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import ROUTE_PATH from "@/routes/route.constants";

const { width } = Dimensions.get("window");

const Header = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(
    "Indore, Madhya Pradesh"
  );
  const { selectedAddress: returnedAddress, searchQuery } =
    useLocalSearchParams();
  const { authUser } = useAuthUser();

  const user = authUser?.user;
  const isGuest = !user;
  const userName = user?.fullName || "Guest";
  const userProfilePicture = user?.profilePicture;

  useEffect(() => {
    if (returnedAddress) setSelectedAddress(returnedAddress);
  }, [returnedAddress]);

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

      {/* Location + Login */}
      <View className="flex-row justify-between items-center mb-5 mt-1">
        {/* Location Selector */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center flex-shrink pr-2"
          onPress={() =>
            router.push({
              pathname: ROUTE_PATH.APP.SELECT_ADDRESS.INDEX,
              params: { current: selectedAddress },
            })
          }
        >
          <Ionicons name="location" size={20} color="#6E6A7C" />
          <View className="ml-2 flex-row items-center flex-shrink">
            <Text
              className="text-sm text-gray-500 font-lexend"
              numberOfLines={1}
            >
              Deliver to
            </Text>
            <Text
              className="text-sm text-gray-500 font-lexend mx-2"
              numberOfLines={1}
            >
              {selectedAddress}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6E6A7C" />
          </View>
        </TouchableOpacity>

        {/* Login Button (only if guest) */}
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

      {/* Greeting */}
      <View className="flex-row items-center mb-5">
        <Avatar size="md" className="mr-3">
          {userProfilePicture ? (
            <AvatarImage source={{ uri: userProfilePicture }} />
          ) : (
            <AvatarFallbackText className="text-2xl font-lexend-bold text-white">
              {userName.charAt(0).toUpperCase()}
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

      {/* Search Area (Clickable only) */}
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
