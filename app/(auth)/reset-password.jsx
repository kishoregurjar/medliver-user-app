import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "@/hooks/useAxios";
import { useRouter, useLocalSearchParams } from "expo-router";
import FORM_VALIDATIONS from "@/libs/form-validations";
import { MaterialIcons } from "@expo/vector-icons";
import ROUTE_PATH from "@/routes/route.constants";
import { useAppToast } from "../../hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import AuthLayout from "@/components/layouts/AuthLayout";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { request: resetPassword, loading: isLoading } = useAxios();
  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.RESET_PASSWORD),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const getPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      letter: /[A-Za-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    let strengthText = "Too weak";
    let strengthColor = "text-red-500";
    if (passed === 2) {
      strengthText = "Good";
      strengthColor = "text-yellow-500";
    } else if (passed === 3) {
      strengthText = "Strong";
      strengthColor = "text-green-600";
    }
    return { ...checks, strengthText, strengthColor };
  };

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(
    getPasswordStrength("")
  );

  const onSubmit = async ({ newPassword }) => {
    const { data, error } = await resetPassword({
      url: "/user/reset-password",
      method: "POST",
      payload: {
        email,
        password: newPassword,
      },
    });

    if (!error && data?.status === 200) {
      showToast("success", data.message || "Password reset successfully.");
      router.replace(ROUTE_PATH.AUTH.LOGIN);
    } else {
      showToast("error", error || "Something went wrong");
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <AuthLayout>
      <View className="items-center mb-10">
        <View className="items-center bg-white rounded-xl p-4">
          <MaterialIcons name="lock-reset" size={50} color="#E2AD5F" />
        </View>
      </View>

      <View className="w-full max-w-md self-center">
        <Text className="text-3xl font-lexend-bold text-black mb-6 text-center">
          Reset Password
        </Text>

        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={[
            {
              name: "newPassword",
              label: "New Password",
              type: "password",
              placeholder: "Enter Your New Password",
              onChangeCustom: (val) => {
                setPasswordValue(val);
                setPasswordStrength(getPasswordStrength(val));
              },
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              placeholder: "Confirm Your Password",
            },
          ]}
        />

        {passwordValue?.length > 0 && (
          <View className="my-3 p-3 rounded-md bg-gray-200">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-medium">Your Password Must Include:</Text>
              <Text className={`font-medium ${passwordStrength.strengthColor}`}>
                {passwordStrength.strengthText}
              </Text>
            </View>

            <View className="gap-1">
              {[
                {
                  label: "At least 8 characters",
                  check: passwordStrength.length,
                },
                {
                  label: "At least 1 letter",
                  check: passwordStrength.letter,
                },
                {
                  label: "At least 1 number",
                  check: passwordStrength.number,
                },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center gap-2">
                  <MaterialIcons
                    name={item.check ? "check-circle" : "cancel"}
                    size={16}
                    color={item.check ? "#16A34A" : "#DC2626"}
                  />
                  <Text
                    className={`text-sm ${
                      item.check ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={`bg-brand-primary rounded-xl py-4 mb-4 ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isLoading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
