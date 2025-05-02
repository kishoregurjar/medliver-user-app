import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import STATIC from "@/utils/constants";
import SearchMedicineModal from "../modals/SearchMedicineModal";
import SelectAddressModal from "../modals/SelectAddressModal";

const { width } = Dimensions.get("window");

const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="p-2">
    {icon}
  </TouchableOpacity>
);

const medicineSuggestions = [
  "Paracetamol",
  "Aspirin",
  "Ibuprofen",
  "Amoxicillin",
  "Cough Syrup",
  "Vitamin C",
];

const addresses = [
  "Indore, Madhya Pradesh",
  "Bhopal, Madhya Pradesh",
  "Mumbai, Maharashtra",
  "Delhi, India",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
];

const Header = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(
    "Indore, Madhya Pradesh"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  return (
    <SafeAreaView className={`${Platform.OS === "android" ? "pt-4" : ""}`}>
      <View>
        {/* Logo & Icons */}
        <View className="flex-row justify-between items-center mb-5">
          <Image
            source={STATIC.IMAGES.APP.LOGO_H}
            style={{ width: width * 0.4, height: 48 }}
            resizeMode="contain"
          />
          <View className="flex-row items-center space-x-2">
            <IconButton
              icon={
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={24}
                  color="#000"
                />
              }
            />
            <IconButton
              icon={
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="#000"
                />
              }
            />
          </View>
        </View>

        {/* Location & Login */}
        <View className="flex-row justify-between items-center mb-5">
          {/* Location */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center flex-1 pr-2"
            onPress={() => setModalVisible(true)}
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
            className="flex-row items-center bg-app-color-red rounded-lg px-4 py-2 ml-2"
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
        <View className="flex-row items-center bg-white border border-app-color-warmgreylight rounded-xl px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#6E6A7C" />
          <TextInput
            placeholder="Search Medicine"
            placeholderTextColor="#6E6A7C"
            className="flex-1 ml-2 font-lexend text-sm text-gray-700"
            onFocus={() => setSearchModalVisible(true)} // Trigger the modal on focus
          />
          <IconButton
            icon={<Feather name="sliders" size={20} color="#6E6A7C" />}
          />
        </View>
      </View>

      {/* Address Selection Modal */}
      <SelectAddressModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={setSelectedAddress}
        addresses={addresses}
      />
      {/* Search Modal with Medicine Suggestions */}
      <SearchMedicineModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSelect={(medicine) => {
          console.log("Selected medicine: ", medicine);
          setSearchModalVisible(false);
        }}
        suggestions={medicineSuggestions}
      />
    </SafeAreaView>
  );
};

export default Header;
