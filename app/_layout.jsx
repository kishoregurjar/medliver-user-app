import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import {
  LexendDeca_100Thin,
  LexendDeca_200ExtraLight,
  LexendDeca_300Light,
  LexendDeca_400Regular,
  LexendDeca_500Medium,
  LexendDeca_600SemiBold,
  LexendDeca_700Bold,
  LexendDeca_800ExtraBold,
  LexendDeca_900Black,
} from "@expo-google-fonts/lexend-deca";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "@gluestack-ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { NavigationHistoryProvider } from "@/contexts/NavigationHistoryContext";
import { ConfigProvider } from "@/contexts/ConfigContext";

import { useDevPerfLogger } from "@/hooks/useDevPerfLogger";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  if (__DEV__) useDevPerfLogger();

  const [fontsLoaded] = useFonts({
    LexendDeca_100Thin,
    LexendDeca_200ExtraLight,
    LexendDeca_300Light,
    LexendDeca_400Regular,
    LexendDeca_500Medium,
    LexendDeca_600SemiBold,
    LexendDeca_700Bold,
    LexendDeca_800ExtraBold,
    LexendDeca_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GluestackUIProvider>
      <AuthProvider>
        <ConfigProvider>
          <LocationProvider>
            <CartProvider>
              <NotificationProvider>
                <NavigationHistoryProvider>
                  <ToastProvider>
                    <ThemeProvider
                      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                    >
                      <ActionSheetProvider>
                        <SafeAreaProvider>
                          <StatusBar
                            style={colorScheme === "dark" ? "light" : "dark"}
                          />
                          <Stack screenOptions={{ headerShown: false }} />
                        </SafeAreaProvider>
                      </ActionSheetProvider>
                    </ThemeProvider>
                  </ToastProvider>
                </NavigationHistoryProvider>
              </NotificationProvider>
            </CartProvider>
          </LocationProvider>
        </ConfigProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
