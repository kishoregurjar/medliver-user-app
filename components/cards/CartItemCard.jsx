import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartItemCard({
  item,
  quantity,
  onRemove,
  onQuantityChange,
}) {
  return (
    <View className="bg-white p-4 my-1 rounded-xl flex-row items-start gap-4">
      <View className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          source={{
            uri: item.item_id.image || "https://via.placeholder.com/100",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        <Text className="text-lg font-lexend-semibold" numberOfLines={1}>
          {item.name || item.item_id.name}
        </Text>
        <Text className="text-sm text-gray-600">
          {item.item_id.short_composition1}
        </Text>
        <Text className="text-sm text-gray-600">
          {item.item_id.packSizeLabel}
        </Text>
        <Text className="text-base text-text-muted mt-1">
          ₹{item.price.toFixed(2)} x {quantity} = ₹
          {(item.price * quantity).toFixed(2)}
        </Text>

        <View className="flex-row justify-between items-center mt-3">
          <TouchableOpacity
            onPress={onRemove}
            activeOpacity={0.8}
            className="bg-brand-primary flex-row items-center px-4 py-2 rounded-xl"
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text className="ml-2 text-white text-sm font-lexend-medium">
              Remove
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center bg-text-muted/20 border border-gray-200 rounded-lg p-2">
            <TouchableOpacity
              onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full border border-text-muted justify-center items-center"
            >
              <Ionicons name="remove" size={18} color="#B31F24" />
            </TouchableOpacity>

            <View className="mx-3 min-w-[32px] items-center justify-center">
              <Text className="text-base font-lexend-semibold text-text-muted">
                {quantity}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => onQuantityChange(quantity + 1)}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full border border-text-muted justify-center items-center"
            >
              <Ionicons name="add" size={18} color="#B31F24" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
