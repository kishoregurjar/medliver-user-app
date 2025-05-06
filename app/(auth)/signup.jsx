import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { socialButtons } from "@/utils/constants";
import { useAuthUser } from "@/contexts/AuthContext";
import useAxios from "@/hooks/useAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FormError from "@/components/inputs/FormError";
import { generateDynamicRoute } from "@/utils/generateDynamicRoute";
import ROUTE_PATH from "@/routes/route.constants";
import { useAppToast } from "../../hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import AuthLayout from "@/components/layouts/AuthLayout";

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
    <AuthLayout>
      <View className="w-full max-w-md self-center">
        <Text className="text-3xl mb-6 mt-6 font-lexend-bold text-black">
          Create Account
        </Text>

        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={FORM_FIELD_TYPES.SIGN_UP}
        />

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
          <Text className="text-xs text-text-muted font-lexend-bold flex-1">
            By continuing, you agree to our Terms of Services, Privacy Policy.
          </Text>
        </View>
        <FormError error={errors.agree?.message} className="mt-2" />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className={`bg-brand-primary rounded-xl py-4 mb-4 ${
            isLoading ? "opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isLoading ? "Signing up..." : "Sign up"}
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-text-muted font-lexend mb-4">
          or Sign up with
        </Text>

        {socialButtons.map(({ icon: Icon, iconName, color, text }, index) => (
          <Button
            key={index}
            variant="outline"
            size="xl"
            className="my-1 mx-4 border border-background-soft rounded-lg flex-row items-center justify-center"
          >
            <View className="mr-3 w-6 items-center">
              <Icon name={iconName} size={20} color={color} />
            </View>
            <ButtonText className="text-sm font-lexend">{text}</ButtonText>
          </Button>
        ))}

        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-text-muted font-lexend-bold">
            Already have an account?
          </Text>
          <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}>
            <Text className="text-accent-softIndigo font-lexend-bold ml-2">
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}
