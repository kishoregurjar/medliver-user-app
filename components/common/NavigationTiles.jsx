import { View, Text, TouchableOpacity, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function NavigationTiles() {
  const router = useRouter();

  const tiles = [
    {
      label: "Medicine",
      description: "Order medicines at your doorstep",
      icon: "medkit-outline",
      path: "/medicine",
      bgColor: "bg-app-color-lightbrown",
      iconCircleColor: "bg-app-color-red",
      iconColor: "white",
      textColor: "text-brown",
      descriptionColor: "text-brown/70", // ⬅️ NEW
    },
    {
      label: "Pathology",
      description: "Book blood tests easily",
      icon: "flask-outline",
      path: "/pathology",
      bgColor: "bg-white",
      iconCircleColor: "bg-blue-100",
      iconColor: "black",
      textColor: "text-black",
      descriptionColor: "text-gray-500", // ⬅️ NEW
    },
    {
      label: "Insurance",
      description: "Secure your health today",
      icon: "shield-checkmark-outline",
      path: "/insurance",
      bgColor: "bg-app-color-red",
      iconCircleColor: "bg-red-400",
      iconColor: "white",
      textColor: "text-white",
      descriptionColor: "text-white", // ⬅️ NEW
    },
    {
      label: "Emergency Cab",
      description: "Book cab in emergencies",
      icon: "car-sport-outline",
      path: "/cab",
      bgColor: "bg-app-color-lightgrey",
      iconCircleColor: "bg-gray-300",
      iconColor: "black",
      textColor: "text-black",
      descriptionColor: "text-gray-500", // ⬅️ NEW
    },
  ];

  return (
    <View className="flex-row flex-wrap justify-between p-4">
      {tiles.map((tile, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          className={`w-[48%] aspect-square rounded-2xl mb-4 p-4 ${tile.bgColor}`}
          style={{
            elevation: Platform.OS === "android" ? 3 : 0, // Android shadow
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 }, // iOS shadow
          }}
          onPress={() => router.push(tile.path)}
        >
          {/* Icon inside colored circle */}
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${tile.iconCircleColor}`}
          >
            <Ionicons name={tile.icon} size={24} color={tile.iconColor} />
          </View>

          {/* Label and Description */}
          <View className="mt-4">
            <Text
              className={`text-base font-semibold ${
                tile.textColor || "text-gray-800"
              }`}
              numberOfLines={1}
            >
              {tile.label}
            </Text>
            <Text
              className={`text-xs mt-1 ${
                tile.descriptionColor || "text-gray-500"
              }`} // ⬅️ NEW
              numberOfLines={2}
            >
              {tile.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
