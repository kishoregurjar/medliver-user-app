import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/app/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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
import { View, Platform } from "react-native";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@gluestack-ui/toast";

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
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <SafeAreaProvider>
              <SafeAreaView
                className="flex-1 bg-white dark:bg-black"
                edges={["top", "left", "right"]}
              >
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <View className="flex-1 min-h-full font-lexend bg-white dark:bg-black">
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="home" />
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/signup" />
                    <Stack.Screen name="(auth)/forgot" />
                    <Stack.Screen name="(auth)/otp-verification.jsx" />
                    <Stack.Screen name="(auth)/reset-password" />
                    <Stack.Screen name="(home)" />
                  </Stack>
                </View>
              </SafeAreaView>
            </SafeAreaProvider>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
