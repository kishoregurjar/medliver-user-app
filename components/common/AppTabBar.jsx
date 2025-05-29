// components/CustomTabBar.tsx
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
      icon: "home-outline",
      label: "Home",
      path: ROUTE_PATH.APP.HOME,
    },
    {
      name: "explore",
      icon: "search-outline",
      label: "Explore",
      path: ROUTE_PATH.APP.SEARCH.INDEX,
    },
    {
      name: "cart",
      icon: "cart-outline",
      label: "Cart",
      badge: itemCount,
      path: ROUTE_PATH.APP.CART.INDEX,
    },
    {
      name: "account",
      icon: "person-outline",
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
          bottom: insets.bottom > 0 ? insets.bottom : 16,
        },
      ]}
      className="absolute left-4 right-4 h-[70px] z-50 bg-brand-primary rounded-full flex-row justify-around items-center overflow-hidden"
    >
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.path)}
            className="items-center justify-center relative"
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? "#FCDEC7" : "#D2FFDE"}
            />
            <Text
              className={`text-[12px] mt-1 font-lexend-bold ${
                isActive ? "text-brand-background" : "text-accent-mint"
              }`}
            >
              {tab.label}
            </Text>
            {!!tab.badge && tab.badge > 0 && (
              <View className="absolute top-0 right-0 -translate-y-1 translate-x-1 bg-brand-background rounded-full px-1.5 py-0.5">
                <Text className="text-text-primary text-[10px] font-lexend">
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
