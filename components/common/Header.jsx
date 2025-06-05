import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";

import HeaderWithBack from "./HeaderWithBack";
import { useAuthUser } from "@/contexts/AuthContext";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import ROUTE_PATH from "@/routes/route.constants";
import { useAppToast } from "@/hooks/useAppToast";

const { width } = Dimensions.get("window");

const Header = () => {
  const router = useRouter();
  const { showToast } = useAppToast();
  const { selectedAddress: returnedAddress } = useLocalSearchParams();
  const { authUser } = useAuthUser();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const user = authUser?.user;
  const isGuest = !user;
  const userName = user?.fullName || "Guest";
  const userProfilePicture = user?.profilePicture;

  // If address returned from SELECT_LOCATION screen
  useEffect(() => {
    if (returnedAddress) {
      setSelectedAddress(returnedAddress);
    }
  }, [returnedAddress]);

  // Get location on mount
  useEffect(() => {
    if (!returnedAddress) fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("error", "Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverse = await Location.reverseGeocodeAsync(loc.coords);
      const address = reverse[0];

      if (address) {
        const composed = `${address.city || ""}, ${address.region || ""}${
          address.postalCode ? `, ${address.postalCode}` : ""
        }`;
        setSelectedAddress(composed.trim());
      } else {
        setSelectedAddress("Location not found");
      }
    } catch (err) {
      console.error("Location error:", err);
      showToast("error", "Failed to get location");
    } finally {
      setLocationLoading(false);
    }
  };

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
              params: { current: selectedAddress },
            })
          }
        >
          <Ionicons name="navigate" size={20} color="#6E6A7C" />
          <View className="ml-2 flex-row items-center flex-shrink">
            <Text className="text-sm text-text-muted font-lexend">
              Deliver to
            </Text>
            {locationLoading ? (
              <Text className="text-sm text-text-muted font-lexend mx-2">
                Locating...
              </Text>
            ) : (
              <Text
                className="text-sm text-text-muted font-lexend mx-2"
                numberOfLines={1}
              >
                {selectedAddress || "Fetching location..."}
              </Text>
            )}
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
