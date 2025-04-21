// app/(auth)/forgot.tsx

import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import GradientBackground from "@/components/common/GradientEllipse";
import { Button, ButtonText } from "@/components/ui/button";
import STATIC from "@/utils/constants";
import axios from "axios";
import { useRouter } from "expo-router";

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: any) => {
    console.log("Forgot password data:", payload);
    try {
      const response = await axios.post(
        "http://192.168.1.3:4002/api/v1/user/forgot-password",
        payload
      );
      console.log("Reset request successful:", response.data);
      // Handle post-submit logic (toast, redirect, etc.)
    } catch (error) {
      console.error("Reset request error:", error);
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
                source={STATIC.IMAGES.PAGES.LOGIN} // Add image in your STATIC
                style={{ width: 200, height: 200, resizeMode: "contain" }}
              />
            </View>

            <Text className="text-3xl font-bold mb-6 text-black">
              Forgot Password
            </Text>

            <FormLabel label="Your Email" />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <StyledInput
                  placeholder="Enter Your Email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            <FormError error={errors.email?.message} />

            <Button
              onPress={handleSubmit(onSubmit)}
              className="mt-4 bg-app-color-red"
            >
              <ButtonText className="text-white text-base font-semibold">
                Send Reset Link
              </ButtonText>
            </Button>

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

// Reusable Components
const FormLabel = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <Text className={`text-xs text-app-color-grey mb-2 font-bold ${className}`}>
    {label}
  </Text>
);

const FormError = ({ error }: { error?: string }) =>
  error ? <Text className="text-red-500 text-xs mb-2">{error}</Text> : null;

const StyledInput = (props: any) => (
  <TextInput
    className="border border-app-color-warmgreylight rounded-md px-4 py-3 mb-3 text-black"
    placeholderTextColor="#999"
    {...props}
  />
);
