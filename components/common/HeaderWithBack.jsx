import { Text, View, TouchableOpacity, Platform, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import STATIC from "@/utils/constants";
import ROUTE_PATH from "@/routes/route.constants";

const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="p-2">
    {icon}
  </TouchableOpacity>
);

export default function HeaderWithBack({
  title,
  clearStack = false,
  backTo,
  showBackButton = false,
  showSearch = false,
  showCart = false,
  showNotification = false,
  iconNavigation = {
    search: { to: ROUTE_PATH.APP.SEARCH.INDEX, clearStack: false },
    cart: { to: ROUTE_PATH.APP.CART.INDEX, clearStack: false },
    notification: { to: ROUTE_PATH.APP.NOTIFICATION.INDEX, clearStack: false },
  },
}) {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.replace(backTo);
    } else if (clearStack) {
      router.replace(ROUTE_PATH.APP.HOME);
    } else {
      router.back();
    }
  };

  const handleIconPress = (type) => {
    const config = iconNavigation[type];
    if (!config) return;
    config.clearStack ? router.replace(config.to) : router.push(config.to);
  };

  return (
    <View
      className="flex-row items-center justify-between"
      style={{
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
        height:
          56 + (Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0),
      }}
    >
      {/* Back Icon + Title (if title is given) */}
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}

        {title ? (
          <Text className="text-xl font-lexend-bold text-black">{title}</Text>
        ) : (
          <TouchableOpacity onPress={() => router.replace(ROUTE_PATH.APP.HOME)}>
            <Image source={STATIC.IMAGES.APP.LOGO_H} resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>

      {/* Right-side Icons */}
      <View className="flex-row items-center space-x-2">
        {showSearch && (
          <IconButton
            onPress={() => handleIconPress("search")}
            icon={
              <MaterialCommunityIcons name="magnify" size={24} color="#000" />
            }
          />
        )}
        {showCart && (
          <IconButton
            onPress={() => handleIconPress("cart")}
            icon={
              <MaterialCommunityIcons
                name="cart-outline"
                size={24}
                color="#000"
              />
            }
          />
        )}
        {showNotification && (
          <IconButton
            onPress={() => handleIconPress("notification")}
            icon={
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#000"
              />
            }
          />
        )}
      </View>
    </View>
  );
}
