import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GradientBackground from "@/components/common/GradientEllipse";
import FormLabel from "@/components/inputs/FormLabel";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import FormError from "@/components/inputs/FormError";
import useAxios from "@/hooks/useAxios";
import { useRouter, useLocalSearchParams } from "expo-router";
import FORM_VALIDATIONS from "@/libs/form-validations";
import { MaterialIcons } from "@expo/vector-icons";
import ROUTE_PATH from "@/routes/route.constants";

const ResetPasswordScreen = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const {
    request: resetPassword,
    loading: isLoading,
    error: hasError,
  } = useAxios();

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

    return {
      ...checks,
      strengthText,
      strengthColor,
    };
  };

  // Toggle password visibility states
  const [secureFields, setSecureFields] = useState({
    newPassword: true,
    confirmPassword: true,
  });
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(
    getPasswordStrength("")
  );

  const toggleSecure = (field) => {
    setSecureFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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
      router.replace(ROUTE_PATH.AUTH.LOGIN);
    } else {
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <GradientBackground
      animateBlobs
      animationType="pulse"
      animationSpeed={1000}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: width < 360 ? 16 : 24,
              paddingBottom: 100,
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <View className="items-center mb-10">
              <View className="items-center bg-white rounded-xl p-4">
                <MaterialIcons name="lock-reset" size={50} color="#E2AD5F" />
              </View>
            </View>

            <View className="w-full max-w-md self-center">
              <Text className="text-3xl font-lexend-bold text-black mb-6 text-center">
                Reset Password
              </Text>

              {[
                {
                  name: "newPassword",
                  label: "New Password",
                },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
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
                        onChangeText={(text) => {
                          onChange(text);
                          if (field.name === "newPassword") {
                            setPasswordValue(text);
                            setPasswordStrength(getPasswordStrength(text));
                          }
                        }}
                        secureTextEntry={secureFields[field.name]}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() => toggleSecure(field.name)}
                          >
                            <MaterialIcons
                              name={
                                secureFields[field.name]
                                  ? "visibility-off"
                                  : "visibility"
                              }
                              size={20}
                              color="#888"
                            />
                          </TouchableOpacity>
                        }
                      />
                    )}
                  />
                  <FormError
                    error={errors?.[field.name]?.message}
                    className="mt-2"
                  />
                </View>
              ))}

              {passwordValue?.length > 0 && (
                <View className="my-3 p-3 rounded-md bg-gray-200">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium">
                      Your Password Must Include:
                    </Text>
                    <Text
                      className={`font-medium ${passwordStrength.strengthColor}`}
                    >
                      {passwordStrength.strengthText}
                    </Text>
                  </View>

                  <View className="gap-1">
                    {/* Length Check */}
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons
                        name={
                          passwordStrength.length ? "check-circle" : "cancel"
                        }
                        size={16}
                        color={passwordStrength.length ? "#16A34A" : "#DC2626"}
                      />
                      <Text
                        className={`text-sm ${
                          passwordStrength.length
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        At least 8 characters
                      </Text>
                    </View>

                    {/* Letter Check */}
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons
                        name={
                          passwordStrength.letter ? "check-circle" : "cancel"
                        }
                        size={16}
                        color={passwordStrength.letter ? "#16A34A" : "#DC2626"}
                      />
                      <Text
                        className={`text-sm ${
                          passwordStrength.letter
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        At least 1 letter
                      </Text>
                    </View>

                    {/* Number Check */}
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons
                        name={
                          passwordStrength.number ? "check-circle" : "cancel"
                        }
                        size={16}
                        color={passwordStrength.number ? "#16A34A" : "#DC2626"}
                      />
                      <Text
                        className={`text-sm ${
                          passwordStrength.number
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        At least 1 number
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="bg-app-color-red rounded-xl py-4 mt-2"
              >
                <Text className="text-white text-center font-semibold text-base">
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ResetPasswordScreen;
