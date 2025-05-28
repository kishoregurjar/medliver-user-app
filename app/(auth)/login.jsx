import { View, Text, Image } from "react-native";
import React from "react";
import Checkbox from "expo-checkbox";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import STATIC, { socialButtons } from "@/utils/constants";
import { Button, ButtonText } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import FORM_VALIDATIONS from "@/libs/form-validations";
import ROUTE_PATH from "@/routes/route.constants";
import { useAppToast } from "../../hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuthUser } from "@/contexts/AuthContext";
import CTAButton from "@/components/common/CTAButton";

export default function LoginScreen() {
  const router = useRouter();

  const { request: loginUser, loading: isLoading } = useAxios();
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
    delete payload.remember;
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
      <View className="items-center my-4">
        <Image
          source={STATIC.IMAGES.PAGES.LOGIN}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
      </View>

      <Text className="text-3xl font-lexend-bold mb-6 text-black">Sign in</Text>

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
              <Checkbox
                value={value}
                onValueChange={onChange}
                color={value ? "#B31F24" : undefined}
              />
            )}
          />
          <Text className="ml-2 text-sm font-lexend text-gray-700">
            Remember me
          </Text>
        </View>
        <CTAButton
          onPress={() => router.push(ROUTE_PATH.AUTH.FORGOT_PASSWORD)}
          label="Forgot Password?"
          variant="transparent"
          textClassName="text-sm font-lexend-bold text-accent-softIndigo"
        />
      </View>

      <CTAButton
        onPress={handleSubmit(onSubmit)}
        label="Sign In"
        loaderText="Signing In..."
        loading={isLoading}
        disabled={isLoading}
      />

      {/* <Text className="text-center font-lexend text-text-muted my-4">
        or Sign in with
      </Text>

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
            <ButtonText className="text-sm font-lexend-medium">
              {text}
            </ButtonText>
          </Button>
        ))}
      </View> */}

      <View className="flex-row justify-center items-center mt-5">
        <Text className="text-text-muted font-lexend-bold">New User?</Text>
        <CTAButton
          onPress={() => router.push(ROUTE_PATH.AUTH.SIGNUP)}
          label="Sign Up"
          variant="transparent"
          textClassName={"text-accent-softIndigo font-lexend-bold"}
        />
      </View>
    </AuthLayout>
  );
}
