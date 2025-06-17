import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  useWindowDimensions,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import CTAButton from "@/components/common/CTAButton";
import ROUTE_PATH from "@/routes/route.constants";
import STATIC from "@/utils/constants";

const onboardingSteps = [
  {
    title: "Your Health, Delivered\nFast & Safe",
    description:
      "We believe that getting the care you need shouldn't be complicated or time-consuming.",
    animation: STATIC.ANIMATIONS.LETS_START,
  },
  {
    title: "Order Medicines in Minutes",
    description:
      "Browse thousands of medicines and order them instantly with doorstep delivery.",
    animation: STATIC.ANIMATIONS.LETS_START,
  },
  {
    title: "Book Lab Tests Easily",
    description:
      "Schedule diagnostic tests at home with certified labs and real-time tracking.",
    animation: STATIC.ANIMATIONS.LETS_START,
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("onboarding-done");
      if (seen === "true") router.replace(ROUTE_PATH.APP.HOME);
      else setShowOnboarding(true);
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  const goToStep = (index) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(dotAnim, {
        toValue: index,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setStep(index);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
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

  const handleSkip = async () => {
    await AsyncStorage.setItem("onboarding-done", "true");
    router.replace(ROUTE_PATH.APP.HOME);
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

  const current = onboardingSteps[step];
  if (isLoading || !showOnboarding) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient colors={["#e0f7fa", "#fce4ec"]} className="flex-1">
        {/* Skip button */}
        <View className="absolute top-4 right-4 z-10">
          <CTAButton
            onPress={handleSkip}
            label="Skip"
            size="sm"
            variant="custom"
            textClassName="text-brand-primary font-lexend-bold"
          />
        </View>

        {/* Slide content */}
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
          <LottieView
            source={current.animation}
            autoPlay
            loop
            style={{ width: width * 0.8, height: height * 0.35 }}
          />
          <Text
            className="text-center text-text-primary font-lexend-bold mt-6 mb-2"
            style={{
              fontSize: Math.min(width * 0.06, 26),
              lineHeight: Math.min(width * 0.075, 32),
            }}
          >
            {current.title}
          </Text>
          <Text
            className="text-center text-text-muted font-lexend mb-4 px-2"
            style={{
              fontSize: Math.min(width * 0.04, 16),
              lineHeight: 20,
            }}
          >
            {current.description}
          </Text>
        </Animated.View>

        {/* Bottom CTA + Indicators */}
        <View className="px-4 mb-6">
          <CTAButton
            label={step < onboardingSteps.length - 1 ? "Next" : "Get Started"}
            icon={<AntDesign name="arrowright" size={20} color="white" />}
            iconPosition="right"
            onPress={handleNext}
            className="w-full"
            size="lg"
          />

          <View className="flex-row justify-center mt-4 gap-2">
            {onboardingSteps.map((_, i) => {
              const widthAnim = dotAnim.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [6, 16, 6],
                extrapolate: "clamp",
              });
              const bgAnim = dotAnim.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: ["#D1D5DB", "#0EA5E9", "#D1D5DB"],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i}
                  style={{
                    width: widthAnim,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: bgAnim,
                  }}
                />
              );
            })}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
