import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ROUTE_PATH from "@/routes/route.constants";

export default function NavigationTiles() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tiles = [
    {
      label: "Pharmacy",
      icon: "pill",
      cta: "Buy Now",
      path: ROUTE_PATH.APP.PHARMACY.INDEX,
    },
    {
      label: "Pathology & Diagnostics",
      icon: "microscope",
      cta: "Book Test",
      path: ROUTE_PATH.APP.PATHOLOGY.INDEX,
    },
    {
      label: "Insurance",
      icon: "shield-check",
      cta: "Get Now",
      path: ROUTE_PATH.APP.INSURANCE.INDEX,
    },
    {
      label: "Nursing Care",
      icon: "account-heart-outline",
      cta: "Book Now",
      path: ROUTE_PATH.APP.APPOINTMENT.BOOK_AN_APPOINTMENT,
    },
  ];

  return (
    <View className="my-5">
      <View className="mb-5">
        <Text className="text-2xl font-lexend-semibold text-black">
          Quick Links
        </Text>
        <Text className="text-xl font-lexend text-brand-primary">
          Explore our services
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {tiles.map((tile, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(tile.path)}
            activeOpacity={0.8}
            className="bg-white rounded-2xl p-6 mb-4"
            style={{ width: "48%" }} // ensures two columns on all screen sizes
          >
            <View className="items-center justify-center mb-3">
              <View className="w-16 h-16 rounded-full bg-brand-primary/10 items-center justify-center">
                <MaterialCommunityIcons
                  name={tile.icon}
                  size={36}
                  color="#007AFF"
                />
              </View>
            </View>

            <Text className="text-center text-[15px] font-lexend-semibold text-black mb-1">
              {tile.label}
            </Text>
            <Text className="text-center text-xs font-lexend text-brand-primary">
              {tile.cta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
