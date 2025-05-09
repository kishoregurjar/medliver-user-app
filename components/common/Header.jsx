import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import STATIC from "@/utils/constants";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import HeaderWithBack from "./HeaderWithBack";

const { width } = Dimensions.get("window");

const Header = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(
    "Indore, Madhya Pradesh"
  );
  const { selectedAddress: returnedAddress, searchQuery } =
    useLocalSearchParams();

  useEffect(() => {
    if (returnedAddress) {
      setSelectedAddress(returnedAddress);
    }

    if (searchQuery) {
      console.log("Searched for:", searchQuery);
      // Optionally set local state or search directly
    }
  }, [returnedAddress, searchQuery]);

  return (
    <View>
      <View>
        {/* Logo & Icons */}
        <HeaderWithBack
          showCart
          showNotification
          iconNavigation={{
            search: { to: "/search", clearStack: false },
            cart: { to: "/cart", clearStack: false },
            notification: { to: "/notification", clearStack: false },
          }}
        />

        {/* Location & Login */}
        <View className="flex-row justify-between items-center mb-5">
          {/* Location */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center flex-1 pr-2"
            onPress={() =>
              router.push({
                pathname: "/select-address",
                params: { current: selectedAddress },
              })
            }
          >
            <Ionicons name="location" size={20} color="#6E6A7C" />
            <View className="flex-row items-center ml-2 flex-shrink">
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

          {/* Login */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center bg-brand-primary rounded-lg px-4 py-2 ml-2"
            onPress={() => router.push("/login")}
          >
            <Ionicons name="person" size={15} color="#fff" />
            <Text className="text-xs text-white font-lexend ml-2">Login</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View className="flex-row items-center mb-5">
          <Image
            source={STATIC.IMAGES.COMPONENTS.USER}
            className="w-10 h-10 rounded-full mr-3"
            resizeMode="cover"
          />
          <View>
            <Text className="text-xl font-lexendBold text-black">Hi Alex!</Text>
            <Text className="text-sm font-lexend text-gray-500">
              How can I help you today?
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-background-soft rounded-xl px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#6E6A7C" />
          <TextInput
            placeholder="Search Medicine"
            placeholderTextColor="#6E6A7C"
            className="flex-1 ml-2 font-lexend text-sm text-gray-700"
            onFocus={() => router.push("/search")}
          />
          {/* <IconButton
            icon={<Feather name="sliders" size={20} color="#6E6A7C" />}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default Header;
