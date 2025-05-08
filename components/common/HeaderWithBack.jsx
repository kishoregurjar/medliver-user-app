// components/shared/HeaderWithBack.tsx

import { Text, View, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function HeaderWithBack({ title, clearStack = false, backTo }) {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.replace(backTo); // Go to specific screen and clear stack
    } else if (clearStack) {
      router.replace("/"); // Default to home if clearStack = true
    } else {
      router.back(); // Standard back navigation
    }
  };

  return (
    <View
      className="flex-row items-center border-b border-gray-100"
      style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
    >
      <TouchableOpacity onPress={handleBack} className="mr-3">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text className="text-xl font-bold">{title}</Text>
    </View>
  );
}
