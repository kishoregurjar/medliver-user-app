import { usePathname, useRouter } from "expo-router";
import { View, Pressable, Text, Platform } from "react-native";
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

  const activeColor = "#B31F24";
  const inactiveColor = "#6E6A7C";

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          paddingBottom: insets.bottom,
        },
      ]}
      className="absolute left-0 right-0 bottom-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 flex-row justify-around items-center z-50"
    >
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.name);
        const iconName = isActive ? tab.icon : `${tab.icon}-outline`;

        return (
          <Pressable
            key={tab.name}
            onPress={() => router.push(tab.path)}
            android_ripple={{
              color: "rgba(179, 31, 36, 0.2)", // Updated ripple color
              borderless: false,
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: 64,
              paddingTop: 6,
              paddingBottom: 4,
              borderTopWidth: 2,
              borderTopColor: isActive ? activeColor : "transparent",
            }}
          >
            {({ pressed }) => (
              <View
                style={{
                  opacity: pressed && Platform.OS === "ios" ? 0.6 : 1,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isActive ? activeColor : inactiveColor}
                />
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 2,
                    fontFamily: "Lexend-Medium",
                    color: isActive ? activeColor : inactiveColor,
                  }}
                >
                  {tab.label}
                </Text>

                {tab.name === "cart" && tab.badge > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -10,
                      backgroundColor: activeColor,
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                      paddingHorizontal: 3,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 10,
                        fontFamily: "Lexend-SemiBold",
                      }}
                    >
                      {tab.badge}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

export default AppTabBar;
