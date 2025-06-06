import { View, Text, Image } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import STATIC from "@/utils/constants";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import FORM_VALIDATIONS from "@/libs/form-validations";
import ROUTE_PATH from "@/routes/route.constants";
import { generateDynamicRoute } from "@/utils/generateDynamicRoute";
import { useAppToast } from "@/hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import AuthLayout from "@/components/layouts/AuthLayout";
import CTAButton from "@/components/common/CTAButton";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useAppToast();

  const { request: forgotPasswordUser, loading: isLoading } = useAxios();

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
    const { data, error } = await forgotPasswordUser({
      url: "/user/forget-password",
      method: "POST",
      payload,
    });

    if (!error && data.status === 200) {
      showToast("success", data.message || "Password reset link sent.");
      router.push(
        generateDynamicRoute(
          ROUTE_PATH.AUTH.OTP_VERIFICATION,
          { type: "forgot", email: payload.email },
          "queryParams"
        )
      );
    } else {
      showToast("error", error || "Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <View className="items-center my-4">
        <Image
          source={STATIC.IMAGES.PAGES.FORGOT}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
      </View>

      <Text className="text-3xl font-lexend-bold mb-6 text-black">
        Forgot Password
      </Text>

      <FormFieldRenderer
        control={control}
        errors={errors}
        fields={FORM_FIELD_TYPES.FORGOT_PASSWORD}
      />

      <CTAButton
        label="Send OTP"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        loaderText="Sending OTP..."
        disabled={isLoading}
      />

      <CTAButton
        label="Back to Login"
        variant="transparent"
        icon={
          <Ionicons
            name="arrow-back"
            size={20}
            color="black"
            className="mr-4"
          />
        }
        onPress={() => router.back()}
        className={"mt-5"}
      />
    </AuthLayout>
  );
}
