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
import { View } from "react-native";
import { Stack } from "expo-router";

import "@/app/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "@gluestack-ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";

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

SplashScreen.preventAutoHideAsync();

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
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GluestackUIProvider>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <SafeAreaProvider>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <View className="flex-1 bg-white dark:bg-black">
                <Stack screenOptions={{ headerShown: false }} />
              </View>
            </SafeAreaProvider>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
