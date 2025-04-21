import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ROUTE_PATH from "@/libs/route-path";
import { useRouter } from "expo-router";
import GradientBackground from "@/components/common/GradientEllipse";
import STATIC, { socialButtons } from "@/utils/constants";
import { Button, ButtonText } from "@/components/ui/button";

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("Login data:", data);
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
                source={STATIC.IMAGES.PAGES.LOGIN}
                style={{ width: 200, height: 200, resizeMode: "contain" }}
              />
            </View>

            <Text className="text-3xl font-bold mb-6 text-black">Sign in</Text>

            {/* Email Input */}
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

            {/* Password Input */}
            <FormLabel label="Password" className="mt-2" />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <StyledInput
                  placeholder="Enter Your Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            <FormError error={errors.password?.message} />

            {/* Remember + Forgot */}
            <View className="flex-row items-center justify-between mt-2 mb-4">
              <View className="flex-row items-center">
                <Controller
                  control={control}
                  name="remember"
                  render={({ field: { value, onChange } }) => (
                    <Checkbox value={value} onValueChange={onChange} />
                  )}
                />
                <Text className="ml-2 text-sm text-gray-700">Remember me</Text>
              </View>
              <Text className="text-sm text-app-color-softindigo font-medium">
                Forgot Password?
              </Text>
            </View>

            {/* Sign In Button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-app-color-red rounded-lg py-3 items-center mb-4"
              android_ripple={{ color: "#c53030" }}
            >
              <Text className="text-white font-semibold text-base">
                Sign in
              </Text>
            </Pressable>

            {/* Divider */}
            <Text className="text-center text-gray-500 mb-4">
              or Sign in with
            </Text>

            {/* Social Buttons */}
            <View>
              {socialButtons.map(
                ({ icon: Icon, iconName, color, text }, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="xl"
                    className="my-1 mx-7 border border-app-color-warmgreylight rounded-lg flex-row items-center justify-center"
                  >
                    <View className="mr-3 w-6 items-center">
                      <Icon name={iconName} size={20} color={color} />
                    </View>
                    <ButtonText className="text-sm font-medium">
                      {text}
                    </ButtonText>
                  </Button>
                )
              )}
            </View>

            {/* Signup Prompt */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-app-color-grey font-bold">New User?</Text>
              <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.SIGNUP)}>
                <Text className="text-app-color-softindigo font-bold ml-2">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

// Reusable components
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
