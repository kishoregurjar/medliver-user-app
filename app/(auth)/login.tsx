import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import ROUTE_PATH from "@/libs/route-path";
import { useRouter } from "expo-router";
import loginImage from "../../assets/images/login.png";
import GradientBackground from "@/components/common/GradientEllipse";
import STATIC from "@/utils/constants";

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen = () => {
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
            {/* Image Illustration */}
            <View className="items-center my-4">
              <Image
                source={STATIC.IMAGES.PAGES.LOGIN}
                style={{ width: 200, height: 200, resizeMode: "contain" }}
              />
            </View>

            <Text className="text-3xl font-bold mb-6 text-black">Sign in</Text>

            <Text className="text-xs text-green-700 mb-1">Your Email</Text>
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

            <Text className="text-xs text-green-700 mb-1 mt-2">Password</Text>
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

            {/* Remember Me and Forgot Password */}
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
              <Text className="text-sm text-violet-700 font-medium">
                Forgot Password?
              </Text>
            </View>

            {/* Sign In Button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-[#E55150] rounded-lg py-3 items-center mb-4"
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

            {/* OAuth Buttons */}
            <View className="space-y-3">
              <OAuthButton
                icon={<AntDesign name="google" size={20} />}
                text="Continue with Google"
              />
              <OAuthButton
                icon={<FontAwesome name="facebook" size={20} color="#4267B2" />}
                text="Continue with Facebook"
              />
              <OAuthButton
                icon={<Ionicons name="logo-apple" size={20} />}
                text="Continue with Apple"
              />
            </View>

            {/* Sign Up Prompt */}
            <Text className="text-center text-sm mt-6">
              New User?{" "}
              <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.SIGNUP)}>
                <Text className="text-[#E55150] font-semibold">Sign Up</Text>
              </Pressable>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default LoginScreen;

// Reusable Components

const StyledInput = (props: any) => (
  <TextInput
    className="border border-gray-300 rounded-md px-4 py-3 mb-2 text-black"
    placeholderTextColor="#999"
    {...props}
  />
);

const FormError = ({ error }: { error?: string }) =>
  error ? <Text className="text-red-500 text-xs mb-2">{error}</Text> : null;

const OAuthButton = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 py-3 rounded-lg bg-white">
    <View className="mr-3">{icon}</View>
    <Text className="text-sm font-medium">{text}</Text>
  </TouchableOpacity>
);
