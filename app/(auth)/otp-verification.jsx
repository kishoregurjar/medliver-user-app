import React from "react";
import { View, Text, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useLocalSearchParams } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import STATIC from "@/utils/constants";
import customTheme from "@/themes/customTheme";
import useAxios from "@/hooks/useAxios";
import ROUTE_PATH from "@/routes/route.constants";
import { generateDynamicRoute } from "@/utils/generateDynamicRoute";
import { useAppToast } from "../../hooks/useAppToast";
import AuthLayout from "@/components/layouts/AuthLayout";
import CTAButton from "@/components/common/CTAButton";
import { Ionicons } from "@expo/vector-icons";

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
    <AuthLayout>
      <View className="items-center mb-10">
        <Image
          source={STATIC.IMAGES.PAGES.VERIFICATION}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>

      <Text className="text-2xl font-lexend-bold text-text-primary text-center mb-2">
        Enter OTP
      </Text>

      <View className="flex items-center justify-center mb-10">
        <Text className="text-lg font-lexend text-text-muted text-center">
          We have sent you a code to{" "}
        </Text>
        <Text className="text-blue-600 font-lexend-semibold">{email}</Text>
      </View>

      <View className="mb-5">
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
          <Text className="text-red-500 text-xs font-lexend text-center my-4">
            {errors.otp.message}
          </Text>
        )}
      </View>

      <View className="flex-row justify-evenly items-center mb-4">
        <Text className="text-sm font-lexend text-text-muted text-center">
          Didn’t receive the Code?
        </Text>
        <CTAButton
          label="Resend Code"
          onPress={() => {}}
          variant="transparent"
        />
      </View>

      <CTAButton
        label="Continue"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
        loaderText="Verifying..."
      />

      <CTAButton
        label="Back to Forgot Password"
        variant="transparent"
        icon={
          <Ionicons
            name="arrow-back"
            size={20}
            color="black"
            className="mr-4"
          />
        }
        onPress={() => router.back()}
        className={"mt-5"}
      />
    </AuthLayout>
  );
}
