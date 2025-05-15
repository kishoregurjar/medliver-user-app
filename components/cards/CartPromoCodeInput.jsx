import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartPromoCodeInput({
  isApplied,
  onToggle,
  promoCode,
  onChangeCode,
}) {
  return (
    <View>
      <TouchableOpacity
        className="bg-white p-5 rounded-xl flex-row items-center space-x-3 mt-4"
        onPress={onToggle}
      >
        <Ionicons
          name={isApplied ? "radio-button-on" : "radio-button-off"}
          size={24}
        />
        <Text className="text-base font-lexend text-gray-800">
          Apply Promo Code
        </Text>
      </TouchableOpacity>

      {isApplied && (
        <TextInput
          value={promoCode}
          onChangeText={onChangeCode}
          placeholder="Enter Promo Code"
          className="bg-white p-5 rounded-xl font-lexend shadow-md mt-2"
        />
      )}
    </View>
  );
}
