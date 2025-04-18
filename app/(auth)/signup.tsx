import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import * as Location from "expo-location";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/libs/route-path";
import GradientBackground from "@/components/common/GradientEllipse";
import axios from "axios";
import useAxios from "@/hooks/useAxios";

// Validation schema
const schema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  agree: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

export default function SignupScreen() {
  const router = useRouter();

  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "", // <-- added
      password: "",
      confirmPassword: "",
      agree: false,
    },
    mode: "onChange",
  });

  const {
    request: registerUser,
    loading: isRegistering,
    error: registerError,
  } = useAxios();

  const onSubmit = async (payload: any) => {
    const payloadToSend = {
      ...payload,
      userCoordinates: location || { lat: 0, long: 0 },
    };

    const { data, error } = await registerUser({
      method: "POST",
      url: "/api/auth/signup",
      payload: payloadToSend,
    });

    if (!error) {
      alert("Account created successfully");
      router.push(ROUTE_PATH.LOGIN);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        long: loc.coords.longitude,
      });
    })();
  }, []);

  return (
    <GradientBackground
      animateBlobs
      darkMode={false}
      animationType="pulse"
      animationSpeed={1000}
    >
      <SafeAreaView className="flex-1 ">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20 }}
          >
            <Text className="text-3xl font-bold mb-6 text-black">
              Create Account
            </Text>

            <FormLabel label="Full Name" />
            <Controller
              control={control}
              name="fullName"
              render={({ field: { value, onChange } }) => (
                <StyledInput
                  placeholder="Enter Your Full Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <FormError error={errors.fullName?.message} />

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

            <FormLabel label="Phone Number" />
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { value, onChange } }) => (
                <StyledInput
                  placeholder="Enter Your Phone Number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
              )}
            />
            <FormError error={errors.phoneNumber?.message} />

            <FormLabel label="Password" />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <StyledInput
                  placeholder="Enter Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <FormError error={errors.password?.message} />

            <FormLabel label="Confirm Password" />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <StyledInput
                  placeholder="Enter Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <FormError error={errors.confirmPassword?.message} />

            <View className="flex-row items-start mb-4 mt-2">
              <Controller
                control={control}
                name="agree"
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    value={value}
                    onValueChange={onChange}
                    color={value ? "#E55150" : undefined}
                  />
                )}
              />
              <Text className="ml-2 text-xs text-gray-600 flex-1">
                By continuing, you agree to our Terms of Services, Privacy
                Policy.
              </Text>
            </View>
            <FormError error={errors.agree?.message} />

            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-[#E55150] rounded-lg py-3 items-center mb-4"
              android_ripple={{ color: "#c53030" }}
            >
              <Text className="text-white font-semibold text-base">
                Sign up
              </Text>
            </Pressable>

            <Text className="text-center text-gray-500 mb-4">
              or Sign up with
            </Text>

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

            <Text className="text-center text-sm mt-6">
              Already have an account?{" "}
              <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}>
                <Text className="text-[#E55150] font-semibold">Login</Text>
              </Pressable>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

// Reusable Components

const FormLabel = ({ label }: { label: string }) => (
  <Text className="text-xs text-green-700 mb-1">{label}</Text>
);

const FormError = ({ error }: { error?: string }) =>
  error ? <Text className="text-red-500 text-xs mb-2">{error}</Text> : null;

const StyledInput = (props: any) => (
  <TextInput
    className="border border-gray-300 rounded-md px-4 py-3 mb-2 text-black"
    placeholderTextColor="#999"
    {...props}
  />
);

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
