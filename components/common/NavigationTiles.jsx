import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import STATIC from "@/utils/constants";
import { MaterialIcons } from "@expo/vector-icons";

export default function NavigationTiles() {
  const router = useRouter();

  const tiles = [
    {
      label: "Buy Medicine",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_1,
      cta: "Buy Now",
      path: "/medicine",
    },
    {
      label: "Pathology & Diagnosis",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_2,
      cta: "Book Now",
      path: "/pathology",
    },
    {
      label: "Insurance",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_3,
      cta: "Get Now",
      path: "/insurance",
    },
    {
      label: "Emergency Cab Booking",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_4,
      cta: "Get Now",
      path: "/cab",
    },
  ];

  return (
    <View>
      {tiles.map((tile, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() => router.push(tile.path)}
          className="flex-row bg-white rounded-2xl mb-4 overflow-hidden h-32 p-5"
          style={{
            elevation: Platform.OS === "android" ? 3 : 0,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          {/* Left Half */}
          <View className="w-1/2 px-4 justify-center">
            <Text className="text-base font-semibold text-app-color-red mb-2">
              {tile.label}
            </Text>

            <View className="flex-row items-center gap-2 space-x-2">
              <Text className="text-sm font-medium text-app-color-red">
                {tile.cta}
              </Text>

              <View className="w-6 h-6 rounded-full bg-black items-center justify-center">
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={10}
                  color="white"
                />
              </View>
            </View>
          </View>

          {/* Right Half */}
          <View className="w-1/2 justify-center items-center">
            <Image
              source={tile.icon}
              resizeMode="cover"
              className="w-24 h-24"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
