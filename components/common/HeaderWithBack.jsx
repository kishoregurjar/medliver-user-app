import { Text, View, TouchableOpacity, Platform, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import STATIC from "@/utils/constants";
import ROUTE_PATH from "@/routes/route.constants";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";

const IconButton = ({ icon, onPress, badgeCount = 0 }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="p-2">
    <View className="relative">
      {icon}
      {badgeCount > 0 && (
        <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 justify-center items-center">
          <Text className="text-white text-xs font-bold">
            {badgeCount > 99 ? "99+" : badgeCount}
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function HeaderWithBack({
  title,
  clearStack = false,
  backTo = null,
  showBackButton = false,
  showSearch = false,
  showCart = false,
  showNotification = false,
  iconNavigation = {
    search: { to: ROUTE_PATH.APP.SEARCH.INDEX, clearStack: false },
    cart: { to: ROUTE_PATH.APP.CART.INDEX, clearStack: false },
    notification: { to: ROUTE_PATH.APP.NOTIFICATIONS.INDEX, clearStack: false },
  },
}) {
  const router = useRouter();
  const { itemCount } = useCart();
  const { unreadCount, notifications, loading, markAsRead } = useNotification();

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
            <Image
              source={STATIC.IMAGES.APP.LOGO_FULL}
              resizeMode="contain"
              className="w-40 h-12"
            />
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
            badgeCount={itemCount}
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
            badgeCount={unreadCount}
          />
        )}
      </View>
    </View>
  );
}
