// components/modals/LoginRequiredModal.jsx

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppToast } from "@/hooks/useAppToast";
import useAxios from "@/hooks/useAxios";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import STATIC from "@/utils/constants";
import CTAButton from "@/components/common/CTAButton";
import { useAuthUser } from "@/contexts/AuthContext";
import { router } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginRequiredModal({ visible, onClose }) {
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
    },
    mode: "onChange",
  });

  const onSubmit = async (payload) => {
    const { data, error } = await loginUser({
      url: "/user/user-login",
      method: "POST",
      payload,
    });

    if (!error) {
      showToast("success", data.message || "User logged in successfully.");
      if (data.status === 200) {
        login(data.data);
        onClose();
      }
    } else {
      showToast("error", error || "Something went wrong");
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.4}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View className="bg-white rounded-t-2xl px-6 pt-6 pb-8 relative">
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 right-4 z-10"
        >
          <MaterialCommunityIcons name="close" size={24} color="black" />
        </TouchableOpacity>

        <View className="items-center my-2">
          <Image
            source={STATIC.IMAGES.PAGES.LOGIN}
            style={{ width: 140, height: 140, resizeMode: "contain" }}
          />
        </View>

        <Text className="text-xl font-lexend-semibold mb-3 text-center">
          Sign in to Continue
        </Text>

        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={FORM_FIELD_TYPES.SIGN_IN}
        />

        {/* Forgot password link */}
        <TouchableOpacity
          onPress={() => {
            onClose();
            router.push(ROUTE_PATH.AUTH.FORGOT_PASSWORD);
          }}
          className="mt-2 mb-4"
        >
          <Text className="text-right text-sm font-lexend-bold text-accent-softIndigo">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <CTAButton
          onPress={handleSubmit(onSubmit)}
          label="Sign In"
          loaderText="Signing In..."
          loading={isLoading}
          disabled={isLoading}
        />

        <CTAButton
          onPress={onClose}
          label="Maybe Later"
          variant="transparent"
          textClassName="text-center text-base text-text-muted mt-3"
        />

        {/* Sign Up */}
        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-text-muted font-lexend-bold">New User?</Text>
          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push(ROUTE_PATH.AUTH.SIGNUP);
            }}
          >
            <Text className="ml-1 text-accent-softIndigo font-lexend-bold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
