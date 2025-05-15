import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartItemCard({
  key,
  item,
  quantity,
  onRemove,
  onQuantityChange,
}) {
  return (
    <View className="bg-white p-4 my-1 rounded-xl flex-row items-start space-x-4">
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
          {item.name}
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
            className="bg-brand-primary/90 p-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="trash-outline" size={16} color="white" />
            <Text className="text-white text-xs ml-1">Remove</Text>
          </TouchableOpacity>

          <View className="flex-row items-center bg-text-muted/20 rounded-lg px-2 py-1">
            <TouchableOpacity
              onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="p-1 rounded-full border border-text-muted"
            >
              <Ionicons name="remove" size={14} color="black" />
            </TouchableOpacity>

            <TextInput
              value={String(quantity)}
              onChangeText={(text) => onQuantityChange(parseInt(text) || 1)}
              keyboardType="numeric"
              maxLength={2}
              className="w-10 text-center text-sm text-text-muted"
            />

            <TouchableOpacity
              onPress={() => onQuantityChange(quantity + 1)}
              className="p-1 rounded-full border border-text-muted"
            >
              <Ionicons name="add" size={14} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
