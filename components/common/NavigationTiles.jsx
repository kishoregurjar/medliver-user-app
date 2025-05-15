import { useRouter } from "expo-router";
import STATIC from "@/utils/constants";
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ROUTE_PATH from "@/routes/route.constants";
const { width, height } = Dimensions.get("window");

export default function NavigationTiles() {
  const router = useRouter();

  const tiles = [
    {
      label: "Buy Medicine",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_1,
      cta: "Buy Now",
      path: ROUTE_PATH.APP.PHARMACY.INDEX,
    },
    {
      label: "Pathology & Diagnosis",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_2,
      cta: "Book Now",
      path: ROUTE_PATH.APP.PATHOLOGY.INDEX,
    },
    {
      label: "Insurance",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_3,
      cta: "Get Now",
      path: ROUTE_PATH.APP.INSURANCE.INDEX,
    },
    // {
    //   label: "Emergency Cab Booking",
    //   icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_4,
    //   cta: "Get Now",
    //   path: ROUTE_PATH.APP.CAB.INDEX,
    // },
    {
      label: "Nursing Services",
      icon: STATIC.IMAGES.COMPONENTS.HOME_NAV_TILE_4,
      cta: "Book Now",
      path: ROUTE_PATH.APP.APPOINTMENT.BOOK_AN_APPOINTMENT,
    },
  ];

  return (
    <View className="mb-6">
      {tiles.map((tile, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(tile.path)}
          activeOpacity={0.9}
          className="bg-white rounded-xl p-5 flex-row mb-4 overflow-hidden shadow-md self-center"
          style={{
            width: width * 0.9, // 90% of screen width
            height: width * 0.48, // Responsive height (~167 if width is ~342)
            elevation: Platform.OS === "android" ? 3 : 0,
            shadowColor: "rgba(162,160,160,0.25)",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 5,
          }}
        >
          {/* Left Half */}
          <View className="w-1/2 px-4 justify-center">
            <Text className="text-base font-lexend-semibold text-brand-primary mb-2">
              {tile.label}
            </Text>

            <View className="flex-row items-center">
              <Text className="text-sm font-lexend-medium text-brand-primary mr-2">
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
