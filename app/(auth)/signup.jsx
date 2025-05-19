import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { socialButtons } from "@/utils/constants";
import useAxios from "@/hooks/useAxios";
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

  const {
    request: registerUser,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const { showToast } = useAppToast();

  const [location, setLocation] = useState(null);
  const [locationPermissionStatus, setLocationPermissionStatus] =
    useState(null);

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
    // Ensure location permission is granted
    let userLocation = location;

    if (locationPermissionStatus !== "granted") {
      userLocation = await requestLocation();
      if (!userLocation) {
        showToast(
          "error",
          "Location permission is required to continue. please allow location access."
        );
        return;
      }
    }

    delete payload.confirmPassword;
    delete payload.agree;

    const payloadToSend = {
      ...payload,
      userCoordinates: userLocation || { lat: 0, long: 0 },
    };

    const { data, error } = await registerUser({
      url: "/user/register-user",
      method: "POST",
      payload: payloadToSend,
    });

    if (!error) {
      showToast("success", data.message || "User registered successfully.");
      if (data?.data?.isVerified === false) {
        router.push(
          generateDynamicRoute(
            ROUTE_PATH.AUTH.OTP_VERIFICATION,
            {
              type: "signup",
              email: payload.email,
            },
            "queryParams"
          )
        );
      }
    } else {
      showToast("error", error || "Something went wrong");
    }
  };

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermissionStatus(status);

    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return null;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      lat: loc.coords.latitude,
      long: loc.coords.longitude,
    };
    setLocation(coords);
    return coords;
  };

  useEffect(() => {
    requestLocation();
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
                color={value ? "#B31F24" : undefined}
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
