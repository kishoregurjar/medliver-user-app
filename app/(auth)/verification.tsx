import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/common/GradientEllipse";
import STATIC from "@/utils/constants";
import ROUTE_PATH from "@/libs/route-path";
import { useRouter } from "expo-router";

export default function VerificationScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp0: "",
      otp1: "",
      otp2: "",
      otp3: "",
    },
    mode: "onChange",
  });

  const inputsRef = useRef<Array<TextInput | null>>([]);

  const onSubmit = (data: any) => {
    const finalOTP = Object.values(data).join("");
    console.log("OTP Submitted:", finalOTP);
    // Send OTP to API or validate
  };

  const handleChange = (
    text: string,
    index: number,
    onChange: (val: string) => void
  ) => {
    onChange(text);
    if (text && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-6"
        >
          <View className="items-center mb-6">
            <Image
              source={STATIC.IMAGES.PAGES.FORGOT}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-bold text-black text-center mb-2">
            Enter OTP
          </Text>
          <Text className="text-base text-gray-500 text-center mb-6">
            We have sent you a code to{" "}
            <Text className="text-blue-600 font-semibold">
              john.martin@gmail.com
            </Text>
          </Text>

          {/* OTP Fields */}
          <View className="flex-row justify-between mb-6">
            {[0, 1, 2, 3].map((index) => (
              <Controller
                key={index}
                control={control}
                name={`otp${index}`}
                rules={{ required: "Required", maxLength: 1 }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    ref={(ref) => (inputsRef.current[index] = ref)}
                    keyboardType="number-pad"
                    maxLength={1}
                    className={`w-16 h-16 text-center text-xl font-semibold rounded-xl border ${
                      value ? "border-green-500" : "border-gray-300"
                    } bg-white`}
                    value={value}
                    onChangeText={(text) => handleChange(text, index, onChange)}
                  />
                )}
              />
            ))}
          </View>

          {Object.values(errors).length > 0 && (
            <Text className="text-red-500 text-xs text-center mb-2">
              Please fill all fields
            </Text>
          )}

          {/* Resend */}
          <Text className="text-sm text-gray-400 text-center mb-6">
            Didn’t receive the text?{" "}
            <Text className="text-black font-semibold">Resend Code</Text>
          </Text>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="bg-app-color-red rounded-xl py-4 mb-4"
          >
            <Text className="text-white text-center font-semibold text-base">
              Continue
            </Text>
          </TouchableOpacity>

          {/* Back to login */}
          <TouchableOpacity
            className="items-center"
            onPress={() => router.replace(ROUTE_PATH.AUTH.LOGIN)}
          >
            <Text className="text-gray-600 text-sm">← Back to Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
