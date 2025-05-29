import React from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useAppToast } from "@/hooks/useAppToast";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import FORM_VALIDATIONS from "@/libs/form-validations";
import CTAButton from "@/components/common/CTAButton";

export default function ChangePasswordScreen() {
  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.CHANGE_PASSWORD),
    mode: "onChange",
  });

  const { request: changePassword, loading: isSubmitting } = useAxios();

  const onSubmit = async (payload) => {
    delete payload.confirmPassword;
    const { data, error } = await changePassword({
      url: "/user/change-password",
      method: "POST",
      authRequired: true,
      payload: payload,
    });

    if (!error) {
      showToast("success", data.message || "Password updated successfully!");
      reset({
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      });
    } else {
      showToast("error", error || "Failed to change password");
    }
  };

  return (
    <AppLayout>
      <HeaderWithBack title="Change Password" showBackButton />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={FORM_FIELD_TYPES.CHANGE_PASSWORD}
        />

        <CTAButton
          label="Change Password"
          onPress={handleSubmit(onSubmit)}
          loaderText="Changing Password..."
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </ScrollView>
    </AppLayout>
  );
}
