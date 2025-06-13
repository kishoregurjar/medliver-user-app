import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useDevPerfLogger } from "@/hooks/useDevPerfLogger";

import "./global.css";

import * as SplashScreen from "expo-splash-screen";
import AppProviders from "@/contexts/AppProviders";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import { enableScreens, screensEnabled } from "react-native-screens";

SplashScreen.preventAutoHideAsync();
enableScreens();
console.log("Screens enabled?", screensEnabled());

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useLoadFonts();

  if (__DEV__) useDevPerfLogger();

  if (!fontsLoaded) return null;

  return (
    <AppProviders>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ActionSheetProvider>
          <SafeAreaProvider>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </ActionSheetProvider>
      </ThemeProvider>
    </AppProviders>
  );
}
