import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { OtpInput } from "react-native-otp-entry";

import GradientBackground from "@/components/common/GradientEllipse";
import STATIC from "@/utils/constants";
import { generateRoute } from "@/routes/route.utils";
import customTheme from "@/themes/customTheme";
import useAxios from "@/hooks/useAxios";
import ROUTE_PATH from "@/routes/route.constants";
import { generateDynamicRoute } from "@/utils/generateDynamicRoute";
import { useAppToast } from "../../hooks/useAppToast";

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { type, email } = useLocalSearchParams();

  const {
    request: verifyOtp,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload) => {
    if (!payload.otp || payload.otp.length < 4) return;

    const payloadToSend = {
      email,
      otp: payload.otp,
    };

    const { data, error } = await verifyOtp({
      url:
        type === "signup"
          ? "/user/verify-otp"
          : type === "forgot"
          ? "/user/verify-forget-password-otp"
          : "/user/verify-otp",
      method: "POST",
      payload: payloadToSend,
    });

    if (!error && data?.status === 200) {
      showToast("success", data.message || "OTP verified successfully.");
      type === "signup" && router.replace(ROUTE_PATH.APP.HOME);
      type === "forgot" &&
        router.replace(
          generateDynamicRoute(
            ROUTE_PATH.AUTH.RESET_PASSWORD,
            { email },
            "queryParams"
          )
        );
    } else {
      showToast("error", error || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-6"
        >
          <View className="items-center mb-10">
            <Image
              source={STATIC.IMAGES.PAGES.VERIFICATION}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-bold text-black text-center mb-2">
            Enter OTP
          </Text>

          <View className="flex items-center justify-center mb-10">
            <Text className="text-lg text-gray-500 text-center">
              We have sent you a code to{" "}
            </Text>
            <Text className="text-blue-600 font-semibold">{email}</Text>
          </View>

          <View className="mb-10">
            <Controller
              control={control}
              name="otp"
              rules={{
                required: "OTP is required",
                minLength: {
                  value: 4,
                  message: "OTP must be at least 4 digits",
                },
              }}
              render={({ field: { value, onBlur } }) => (
                <OtpInput
                  numberOfDigits={4}
                  focusColor="#22c55e"
                  autoFocus={false}
                  hideStick
                  blurOnFilled
                  disabled={false}
                  type="numeric"
                  secureTextEntry={false}
                  focusStickBlinkingDuration={500}
                  onBlur={onBlur}
                  value={value}
                  onTextChange={(text) =>
                    setValue("otp", text, { shouldValidate: true })
                  }
                  onFilled={(text) =>
                    setValue("otp", text, { shouldValidate: true })
                  }
                  textInputProps={{
                    accessibilityLabel: "One-Time Password",
                  }}
                  textProps={{
                    accessibilityRole: "text",
                    accessibilityLabel: "OTP digit",
                    allowFontScaling: false,
                  }}
                  theme={customTheme.otpTheme}
                />
              )}
            />
            {errors.otp && (
              <Text className="text-red-500 text-xs text-center mt-1 mb-2">
                {errors.otp.message}
              </Text>
            )}
          </View>

          <Text className="text-sm text-gray-400 text-center mb-6">
            Didn’t receive the text?{" "}
            <Text className="text-black font-semibold">Resend Code</Text>
          </Text>

          <TouchableOpacity
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
            className={`bg-app-color-red rounded-xl py-4 mb-4 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white text-center font-semibold text-base">
              {isLoading ? "Verifying..." : "Continue"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => router.replace(generateRoute("AUTH", "LOGIN"))}
          >
            <Text className="text-gray-600 text-sm">Back to Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
