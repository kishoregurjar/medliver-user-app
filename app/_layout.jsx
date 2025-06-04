import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, usePathname } from "expo-router";
import { useColorScheme } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "@gluestack-ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

import "./global.css";

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

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname(); // ✅ Safe and simple path tracking

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

  // Hide splash when fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ✅ Log path only in dev mode to avoid clutter
  useEffect(() => {
    if (__DEV__) {
      console.log("[DEV] Current Pathname:", pathname);
    }
  }, [pathname]);

  if (!fontsLoaded) return null;

  return (
    <GluestackUIProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
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
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
