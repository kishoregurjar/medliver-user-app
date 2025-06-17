import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  Animated,
  PanResponder,
} from "react-native";
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
    image: STATIC.IMAGES.PAGES.LETS_START,
  },
  {
    title: "Book Lab Tests Easily",
    description:
      "Schedule diagnostic tests at home with certified labs and real-time tracking.",
    image: STATIC.IMAGES.PAGES.LETS_START,
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

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

  const goToStep = (index) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep(index);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = async () => {
    if (step < onboardingSteps.length - 1) {
      goToStep(step + 1);
    } else {
      await AsyncStorage.setItem("onboarding-done", "true");
      router.replace(ROUTE_PATH.APP.HOME);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -80 && step < onboardingSteps.length - 1) {
          goToStep(step + 1);
        } else if (gesture.dx > 80 && step > 0) {
          goToStep(step - 1);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (isLoading || !showOnboarding) return null;

  const current = onboardingSteps[step];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient colors={["#e0f7fa", "#fce4ec"]} style={{ flex: 1 }}>
        <View className="absolute w-full h-full">
          {/* Background Dots */}
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              className={`absolute bg-opacity-50 rounded-full`}
              style={{
                width: 6 + (i % 2) * 2,
                height: 6 + (i % 2) * 2,
                top: `${10 + i * 10}%`,
                left: `${(i * 13) % 90}%`,
                backgroundColor: ["#FDE68A", "#93C5FD", "#6EE7B7", "#F9A8D4"][
                  i % 4
                ],
                opacity: 0.4,
              }}
            />
          ))}
        </View>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            { flex: 1, opacity: fadeAnim, transform: [{ translateX }] },
            {
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 16,
            },
          ]}
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
            className="text-center text-text-primary font-lexend-bold mb-2"
            style={{
              fontSize: Math.min(width * 0.06, 26),
              lineHeight: Math.min(width * 0.075, 32),
            }}
          >
            {current.title}
          </Text>

          <Text
            className="text-center text-text-muted font-lexend mb-4"
            style={{
              fontSize: Math.min(width * 0.04, 16),
              lineHeight: 20,
              paddingHorizontal: 4,
            }}
          >
            {current.description}
          </Text>
        </Animated.View>

        {/* Bottom CTA + Indicators */}
        <View className="px-4 mb-6">
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

          <View className="flex-row justify-center mt-4 gap-2">
            {onboardingSteps.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full ${
                  i === step ? "bg-brand-primary w-4" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
