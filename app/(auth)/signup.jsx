import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import GradientBackground from "@/components/common/GradientEllipse";
import { Button, ButtonText } from "@/components/ui/button";
import { socialButtons } from "@/utils/constants";
import { useAuthUser } from "@/contexts/AuthContext";
import useAxios from "@/hooks/useAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FormError from "@/components/inputs/FormError";
import FormLabel from "@/components/inputs/FormLabel";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import { generateDynamicRoute } from "@/utils/generateDynamicRoute";
import ROUTE_PATH from "@/routes/route.constants";
import { useAppToast } from "../../hooks/useAppToast";

export default function SignupScreen() {
  const router = useRouter();
  const { authUser } = useAuthUser();

  const {
    request: registerUser,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const { showToast } = useAppToast();

  const [location, setLocation] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.SIGN_UP),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (payload) => {
    const payloadToSend = {
      ...payload,
      userCoordinates: location || { lat: 0, long: 0 },
    };

    console.log("Signup data:", payloadToSend);

    const { data, error } = await registerUser({
      url: "/user/register-user",
      method: "POST",
      payload: payloadToSend,
    });

    console.log("Signup response:", data, error);

    if (!error) {
      showToast("success", data.message || "User registered successfully.");
      data.status === 200
        ? router.push(
            generateDynamicRoute(
              ROUTE_PATH.AUTH.OTP_VERIFICATION,
              {
                type: "signup",
                email: payload.email,
              },
              "queryParams"
            )
          )
        : data.status === 201
        ? router.push(
            generateDynamicRoute(
              ROUTE_PATH.AUTH.OTP_VERIFICATION,
              {
                type: "signup",
                email: payload.email,
              },
              "queryParams"
            )
          )
        : null;
    } else {
      showToast("error", error || "Something went wrong");
      console.log(error || "Something went wrong");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      console.log("registerUser", await AsyncStorage.getAllKeys());

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
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 100,
              flexGrow: 1,
            }}
          >
            <View className="w-full max-w-md self-center">
              <Text className="text-3xl mb-6 mt-6 font-lexend-bold text-black">
                Create Account
              </Text>

              {[
                {
                  name: "fullName",
                  label: "Full Name",
                  keyboardType: "default",
                },
                {
                  name: "email",
                  label: "Your Email",
                  keyboardType: "email-address",
                },
                {
                  name: "phoneNumber",
                  label: "Phone Number",
                  keyboardType: "phone-pad",
                },
                { name: "password", label: "Password", secureTextEntry: true },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
                  secureTextEntry: true,
                },
              ].map((field) => (
                <View key={field.name} className="mb-4">
                  <FormLabel label={field.label} />
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: { value, onChange } }) => (
                      <FormStyledInput
                        placeholder={`Enter ${field.label}`}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={field.keyboardType}
                        secureTextEntry={field.secureTextEntry}
                      />
                    )}
                  />
                  <FormError
                    error={errors?.[field.name]?.message}
                    className="mt-2"
                  />
                </View>
              ))}

              <View className="flex-row items-center mb-4">
                <Controller
                  control={control}
                  name="agree"
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      value={value}
                      onValueChange={onChange}
                      color={value ? "#E55150" : undefined}
                      className="mr-4"
                    />
                  )}
                />
                <Text className="text-xs text-app-color-grey font-lexend-bold flex-1">
                  By continuing, you agree to our Terms of Services, Privacy
                  Policy.
                </Text>
              </View>
              <FormError error={errors.agree?.message} className="mt-2" />

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className={`bg-app-color-red rounded-xl py-4 mb-4 ${
                  isLoading ? "opacity-50" : ""
                }`}
                disabled={isLoading}
              >
                <Text className="text-white text-center font-semibold text-base">
                  {isLoading ? "Signing up..." : "Sign up"}
                </Text>
              </TouchableOpacity>

              <Text className="text-center text-app-color-grey font-lexend mb-4">
                or Sign up with
              </Text>

              {socialButtons.map(
                ({ icon: Icon, iconName, color, text }, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="xl"
                    className="my-1 mx-4 border border-app-color-warmgreylight rounded-lg flex-row items-center justify-center"
                  >
                    <View className="mr-3 w-6 items-center">
                      <Icon name={iconName} size={20} color={color} />
                    </View>
                    <ButtonText className="text-sm font-lexend">
                      {text}
                    </ButtonText>
                  </Button>
                )
              )}

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-app-color-grey font-lexend-bold">
                  Already have an account?
                </Text>
                <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}>
                  <Text className="text-app-color-softindigo font-lexend-bold ml-2">
                    Login
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
