import { usePathname, useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import ROUTE_PATH from "@/routes/route.constants";
import { useCart } from "@/contexts/CartContext";

const AppTabBar = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const tabs = [
    {
      name: "home",
      icon: "home",
      label: "Home",
      path: ROUTE_PATH.APP.HOME,
    },
    {
      name: "explore",
      icon: "search",
      label: "Search",
      path: ROUTE_PATH.APP.SEARCH.INDEX,
    },
    {
      name: "cart",
      icon: "cart",
      label: "Cart",
      badge: itemCount,
      path: ROUTE_PATH.APP.CART.INDEX,
    },
    {
      name: "account",
      icon: "person",
      label: "Account",
      path: ROUTE_PATH.APP.ACCOUNT.INDEX,
    },
  ];

  const isTabBarVisible = !pathname.includes("/product/");

  useEffect(() => {
    translateY.value = withTiming(isTabBarVisible ? 0 : 100, { duration: 300 });
    opacity.value = withTiming(isTabBarVisible ? 1 : 0, { duration: 300 });
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          paddingBottom: insets.bottom,
        },
      ]}
      className="absolute left-0 right-0 bottom-0 h-[64px] bg-white dark:bg-neutral-900 flex-row justify-around items-center border-t border-gray-200 dark:border-neutral-700 z-50"
    >
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.name);
        const iconName = isActive ? `${tab.icon}` : `${tab.icon}-outline`;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.path)}
            className={`flex-1 items-center justify-center relative`}
            activeOpacity={0.8}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isActive ? "#B31F24" : "#6E6A7C"}
            />
            <Text
              className={`text-[11px] mt-1 font-lexend-medium ${
                isActive ? "text-brand-primary" : "text-text-muted"
              }`}
            >
              {tab.label}
            </Text>

            {tab.name === "cart" && tab.badge > 0 && (
              <View className="absolute top-0 right-6 bg-brand-primary rounded-full px-1.5 py-[1px] min-w-[16px] items-center justify-center">
                <Text className="text-white text-[10px] font-lexend-semibold">
                  {tab.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default AppTabBar;
