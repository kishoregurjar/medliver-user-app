// app/_layout.tsx
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
import { Stack } from "expo-router";
import { useColorScheme } from "react-native"; // Use RN's native hook
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "@gluestack-ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "./global.css";

// Load fonts
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
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

SplashScreen.preventAutoHideAsync(); // Show splash screen until fonts load

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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
                    {/* No need for View wrapper — Stack will take up full screen */}
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
