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
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Reusable Icon Button
const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="p-2">
    {icon}
  </TouchableOpacity>
);

const Header = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      {/* Top Row: Logo & Actions */}
      <View className="flex-row justify-between items-center mb-4">
        <Image
          source={STATIC.IMAGES.APP.LOGO_H}
          className="h-12"
          style={{ width: width * 0.4 }}
          resizeMode="contain"
        />
        <View className="flex-row items-center space-x-4">
          <IconButton
            icon={
              <MaterialCommunityIcons
                name="cart-outline"
                size={24}
                color="black"
              />
            }
          />
          <IconButton
            icon={
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="black"
              />
            }
          />
        </View>
      </View>

      {/* Location & Login */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity activeOpacity={0.7} className="flex-row items-center">
          <Ionicons name="location" size={20} color="#6E6A7C" />
          <View className="flex-row items-center ml-2 max-w-[70%]">
            <Text
              className="text-sm font-lexend text-gray-500"
              numberOfLines={1}
            >
              Deliver to
            </Text>
            <Text
              className="text-sm font-lexend text-gray-500 mx-2"
              numberOfLines={1}
            >
              Indore, Madhya Pradesh, India
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6E6A7C" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center bg-app-color-red rounded-lg px-4 py-2 ml-4"
          onPress={() => router.push("/login")}
        >
          <Ionicons name="person" size={15} color="white" />
          <Text className="text-xs font-lexend text-white ml-2">Login</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View className="flex-row items-center mb-4">
        <Image
          source={STATIC.IMAGES.COMPONENTS.USER}
          className="w-10 h-10 rounded-full mr-3"
          resizeMode="cover"
        />
        <View>
          <Text className="text-xl font-lexendBold text-black">Hi Alex!</Text>
          <Text className="text-sm font-lexend text-gray-500">
            How can I help You Today?
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white border border-app-color-warmgreylight rounded-xl px-4 py-3 mb-4">
        <Ionicons name="search" size={20} color="#6E6A7C" />
        <TextInput
          placeholder="Search Medicine"
          placeholderTextColor="#6E6A7C"
          className="flex-1 ml-2 font-lexend text-[14px] text-gray-700"
        />
        <IconButton
          icon={<Feather name="sliders" size={20} color="#6E6A7C" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
