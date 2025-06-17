// app/index.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Animated, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import CTAButton from "@/components/common/CTAButton";
import STATIC from "@/utils/constants";
import ROUTE_PATH from "@/routes/route.constants";

const onboardingSteps = [
  {
    title: "Your Health, Delivered\nFast & Safe",
    description:
      "We believe that getting the care you need shouldn't be complicated or time-consuming.",
    image: STATIC.IMAGES.APP.LOGO_FULL,
  },
  {
    title: "Order Medicines in Minutes",
    description:
      "Browse thousands of medicines and order them instantly with doorstep delivery.",
    image: STATIC.IMAGES.PAGES.LETS_START, // use a second image
  },
  {
    title: "Book Lab Tests Easily",
    description:
      "Schedule diagnostic tests at home with certified labs and real-time tracking.",
    image: STATIC.IMAGES.PAGES.LETS_START, // use a third image
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("onboarding-done");
      if (seen === "true") {
        router.replace(ROUTE_PATH.APP.HOME);
      } else {
        setShowOnboarding(true);
      }
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  const handleNext = async () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (step < onboardingSteps.length - 1) {
        setStep((prev) => prev + 1);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        AsyncStorage.setItem("onboarding-done", "true");
        router.replace(ROUTE_PATH.APP.HOME);
      }
    });
  };

  const current = onboardingSteps[step];

  const dots = [
    { top: "10%", left: "15%", size: 8, color: "bg-yellow-400", opacity: 70 },
    { top: "20%", left: "70%", size: 6, color: "bg-blue-400", opacity: 60 },
    { top: "35%", left: "30%", size: 6, color: "bg-green-400", opacity: 50 },
    { top: "50%", left: "80%", size: 8, color: "bg-pink-400", opacity: 60 },
    { top: "60%", left: "10%", size: 6, color: "bg-purple-400", opacity: 40 },
    { top: "70%", left: "50%", size: 4, color: "bg-yellow-300", opacity: 50 },
    { top: "80%", left: "25%", size: 6, color: "bg-cyan-400", opacity: 60 },
  ];

  if (isLoading || !showOnboarding) return null;

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#e0f7fa", "#fce4ec"]} style={{ flex: 1 }}>
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

        <Animated.View
          style={{ flex: 1, opacity: fadeAnim }}
          className="flex-1 items-center justify-center px-4"
        >
          <Image
            source={current.image}
            resizeMode="contain"
            style={{
              width: width * 0.8,
              height: height * 0.3,
              marginBottom: height * 0.04,
            }}
          />

          <Text
            className="text-center text-text-primary mb-2 font-lexend-bold"
            style={{
              fontSize: Math.min(width * 0.06, 26),
              lineHeight: Math.min(width * 0.075, 32),
            }}
          >
            {current.title}
          </Text>

          <Text
            className="text-center text-text-muted mb-8 font-lexend"
            style={{
              fontSize: Math.min(width * 0.04, 16),
              paddingHorizontal: 4,
              lineHeight: 20,
            }}
          >
            {current.description}
          </Text>

          <CTAButton
            label={step < onboardingSteps.length - 1 ? "Next" : "Get Started"}
            icon={
              <AntDesign
                name="arrowright"
                size={20}
                color="white"
                className="ml-2 items-center"
              />
            }
            iconPosition="right"
            onPress={handleNext}
            className="w-full"
            size="lg"
          />

          {/* Optional step indicators */}
          <View className="flex-row mt-6 gap-2">
            {onboardingSteps.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full ${
                  i === step ? "bg-brand-primary w-4" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}
