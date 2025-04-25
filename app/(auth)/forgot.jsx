// app/(auth)/forgot.tsx

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GradientBackground from "@/components/common/GradientEllipse";
import STATIC from "@/utils/constants";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FormError from "@/components/inputs/FormError";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import FormLabel from "@/components/inputs/FormLabel";
import ROUTE_PATH from "@/routes/route.constants";
import { generateDynamicRoute } from "@/utils/generateDynamicRoute";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const {
    request: forgotPasswordUser,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.FORGOT_PASSWORD),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload) => {
    console.log("Forgot password data:", payload);
    const { data, error } = await forgotPasswordUser({
      url: "/user/forget-password",
      method: "POST",
      payload: payload,
    });

    console.log("Forgot password response:", data, error);

    if (!error) {
      data.status === 200
        ? router.push(
            generateDynamicRoute(
              ROUTE_PATH.AUTH.OTP_VERIFICATION,
              { type: "forgot", email: payload.email },
              "queryParams"
            )
          )
        : null;
    } else {
      console.log(error || "Something went wrong");
    }
  };

  return (
    <GradientBackground darkMode={false}>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20 }}
          >
            {/* Illustration */}
            <View className="items-center my-4">
              <Image
                source={STATIC.IMAGES.PAGES.FORGOT} // Add image in your STATIC
                style={{ width: 200, height: 200, resizeMode: "contain" }}
              />
            </View>

            <Text className="text-3xl font-bold mb-6 text-black">
              Forgot Password
            </Text>

            <View className="mb-4">
              <FormLabel label="Your Email" />
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <FormStyledInput
                    placeholder="Enter Your Email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              <FormError error={errors.email?.message} className="mt-2" />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className={`bg-app-color-red rounded-xl py-4 mb-4 ${
                isLoading ? "opacity-50" : ""
              }`}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {isLoading ? "Sending..." : "Send OTP"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-app-color-grey font-bold">
                Back to login?
              </Text>
              <Text
                onPress={() => router.back()}
                className="text-app-color-softindigo font-bold ml-2"
              >
                Sign In
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
