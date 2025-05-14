import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import Checkbox from "expo-checkbox";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import STATIC, { socialButtons } from "@/utils/constants";
import { Button, ButtonText } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { TouchableOpacity } from "react-native";
import FORM_VALIDATIONS from "@/libs/form-validations";
import ROUTE_PATH from "@/routes/route.constants";
import { useAppToast } from "../../hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuthUser } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();

  const {
    request: loginUser,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const { login } = useAuthUser();

  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.LOGIN),
    defaultValues: {
      email: "",
      password: "",
      // remember: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (payload) => {
    const { data, error } = await loginUser({
      url: "/user/user-login",
      method: "POST",
      payload: payload,
    });

    if (!error) {
      showToast("success", data.message || "User logged in successfully.");
      if (data.status === 200) {
        router.push(ROUTE_PATH.APP.HOME);
        login(data.data);
      }
    } else {
      showToast("error", error || "Something went wrong");
    }
  };

  return (
    <AuthLayout>
      {/* Illustration */}
      <View className="items-center my-4">
        <Image
          source={STATIC.IMAGES.PAGES.LOGIN}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
      </View>

      <Text className="text-3xl font-bold mb-6 text-black">Sign in</Text>

      <FormFieldRenderer
        control={control}
        errors={errors}
        fields={FORM_FIELD_TYPES.SIGN_IN}
      />

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
        <Text
          className="text-sm text-accent-softIndigo font-bold"
          onPress={() => {
            router.push(ROUTE_PATH.AUTH.FORGOT_PASSWORD);
          }}
        >
          Forgot Password?
        </Text>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className={`bg-brand-primary rounded-xl py-4 mb-4 ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <Text className="text-white text-center font-semibold text-base">
          {isLoading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text className="text-center text-gray-500 mb-4">or Sign in with</Text>

      {/* Social Buttons */}
      <View>
        {socialButtons.map(({ icon: Icon, iconName, color, text }, index) => (
          <Button
            key={index}
            variant="outline"
            size="xl"
            className="my-1 mx-7 border border-background-soft rounded-lg flex-row items-center justify-center"
          >
            <View className="mr-3 w-6 items-center">
              <Icon name={iconName} size={20} color={color} />
            </View>
            <ButtonText className="text-sm font-medium">{text}</ButtonText>
          </Button>
        ))}
      </View>

      {/* Signup Prompt */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-text-muted font-bold">New User?</Text>
        <Pressable onPress={() => router.push(ROUTE_PATH.AUTH.SIGNUP)}>
          <Text className="text-accent-softIndigo font-bold ml-2">Sign Up</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}
