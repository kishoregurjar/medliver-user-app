import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartUrgentDeliveryToggle({ urgentDelivery, onToggle }) {
  return (
    <TouchableOpacity
      className="flex-row bg-white p-5 rounded-xl items-center space-x-3 mt-4"
      onPress={onToggle}
    >
      <Ionicons
        name={urgentDelivery ? "checkbox-outline" : "square-outline"}
        size={24}
      />
      <Text className="text-base font-lexend text-gray-800">
        Mark as Urgent Delivery
      </Text>
    </TouchableOpacity>
  );
}
