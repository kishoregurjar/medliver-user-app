import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import STATIC from "@/utils/constants";

const { width } = Dimensions.get("window");

const Header = () => {
  return (
    <SafeAreaView>
      {/* Header Row */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Image
            source={STATIC.IMAGES.APP.LOGO_H}
            className="h-12"
            style={{ width: width * 0.4 }} // 40% of screen width for responsiveness
            resizeMode="contain"
          />
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity activeOpacity={0.7} className="p-2">
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} className="p-2">
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Selector */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Location Button */}
        <TouchableOpacity activeOpacity={0.7} className="flex-row items-center">
          <Ionicons name="location" size={20} color="#6E6A7C" />
          <View className="flex-row items-center ml-2 max-w-[70%]">
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              Deliver to
            </Text>
            <Text className="text-sm text-gray-500 mx-2" numberOfLines={1}>
              Indore, Madhya Pradesh, India Indore, Madhya Pradesh, India
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6E6A7C" />
          </View>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center ml-4 bg-app-color-red rounded-lg px-4 py-2"
        >
          <Ionicons name="person" size={15} color="white" />
          <Text className="text-xs text-white ml-2">Login</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting Row */}
      <View className="flex-row items-center mb-4">
        <Image
          source={STATIC.IMAGES.COMPONENTS.USER}
          className="w-10 h-10 rounded-full mr-3"
          resizeMode="cover"
        />
        <View>
          <Text className="text-xl font-lexendBold text-black">Hi Alex!</Text>
          <Text className="text-sm text-gray-500">
            How can I help You Today?
          </Text>
        </View>
      </View>

      {/* Search Row */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
        <Ionicons name="search" size={20} color="#6E6A7C" />
        <TextInput
          placeholder="Search Medicine"
          placeholderTextColor="#6E6A7C"
          className="flex-1 ml-2 text-[14px] text-gray-700"
        />
        <TouchableOpacity activeOpacity={0.7} className="ml-2">
          <Feather name="sliders" size={20} color="#6E6A7C" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
