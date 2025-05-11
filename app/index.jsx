import { View, Text, Image, useWindowDimensions, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import STATIC from "@/utils/constants";
import AnimatedActionButton from "@/components/common/AnimatedActionButton";
import {
  getFCMToken,
  registerForPushNotificationsAsync,
} from "@/utils/notification";
import ROUTE_PATH from "@/routes/route.constants";
import { SafeAreaView } from "react-native-safe-area-context"; // ← More reliable SafeAreaView

const LetsStartScreen = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        console.log("✅ Push Notification Token:", token);
      } catch (error) {
        console.error("❌ Error setting up notifications:", error);
      }
    };

    setupNotifications();
    getFCMToken();
  }, []);

  const dots = [
    { top: "10%", left: "15%", size: 8, color: "bg-yellow-400", opacity: 70 },
    { top: "20%", left: "70%", size: 6, color: "bg-blue-400", opacity: 60 },
    { top: "35%", left: "30%", size: 6, color: "bg-green-400", opacity: 50 },
    { top: "50%", left: "80%", size: 8, color: "bg-pink-400", opacity: 60 },
    { top: "60%", left: "10%", size: 6, color: "bg-purple-400", opacity: 40 },
    { top: "70%", left: "50%", size: 4, color: "bg-yellow-300", opacity: 50 },
    { top: "80%", left: "25%", size: 6, color: "bg-cyan-400", opacity: 60 },
  ];

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#e0f7fa", "#fce4ec"]} style={{ flex: 1 }}>
        {/* Dots */}
        <View className="absolute w-full h-full">
          {dots.map((dot, index) => (
            <View
              key={index}
              className={`absolute ${dot.color} opacity-${dot.opacity} rounded-full`}
              style={{
                width: dot.size,
                height: dot.size,
                top: dot.top,
                left: dot.left,
              }}
            />
          ))}
        </View>

        <View className="flex-1 items-center justify-center px-4">
          <Image
            source={STATIC.IMAGES.PAGES.LETS_START}
            resizeMode="contain"
            style={{
              width: width * 0.6,
              height: height * 0.3,
              marginBottom: height * 0.04,
            }}
          />

          <Text
            className="text-center text-gray-900 mb-2 font-lexend-bold"
            style={{
              fontSize: Math.min(width * 0.06, 26),
              lineHeight: Math.min(width * 0.075, 32),
            }}
          >
            Your Health, Delivered{"\n"}Fast & Safe
          </Text>

          <Text
            className="text-center text-gray-500 mb-8 font-lexend"
            style={{
              fontSize: Math.min(width * 0.04, 16),
              paddingHorizontal: 4,
              lineHeight: 20,
            }}
          >
            We believe that getting the care you need shouldn't be complicated
            or time-consuming. Whether it's ordering medicines or booking
            diagnostic tests.
          </Text>

          <AnimatedActionButton
            text="Let's Start"
            icon={<AntDesign name="arrowright" size={24} color="white" />}
            onPress={() => router.replace(ROUTE_PATH.APP.HOME)}
            textClassName="font-lexend-bold text-white mr-2"
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LetsStartScreen;
