import React, { useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import { useAppToast } from "@/hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import SkeletonFormField from "@/components/skeletons/SkeletonFormField";

export default function EditProfileScreen() {
  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.EDIT_PROFILE),
    mode: "onChange",
  });

  const { request: getProfile, loading: isLoading } = useAxios();
  const { request: editProfile, loading: isEditing } = useAxios();

  const onSubmit = async (payload) => {
    console.log("Payload:", payload);

    const { data, error } = await editProfile({
      url: "/user/update-user-profile",
      method: "PATCH",
      authRequired: true,
      payload: payload,
    });

    if (error) {
      showToast("error", error || "Failed to update profile");
    } else {
      showToast("success", data.message || "Profile updated successfully!");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await getProfile({
        url: "/user/get-user-details",
        method: "GET",
        authRequired: true,
      });

      if (error) {
        console.error("Error fetching user profile:", error);
        showToast("error", error || "Failed to load profile");
        return;
      }

      if (data?.data) {
        const user = data.data;
        console.log("User Profile:", user);

        reset({
          fullName: user.fullName || null,
          email: user.email || null,
          phoneNumber: user.phoneNumber || null,
          height: user.height || null,
          weight: user.weight || null,
          bloodGroup: user.bloodGroup || null,
        });
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <AppLayout>
      <HeaderWithBack title="Edit Profile" showBackButton />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <>
            {FORM_FIELD_TYPES.EDIT_PROFILE.map((_, index) => (
              <SkeletonFormField key={index} />
            ))}
          </>
        ) : (
          <>
            <FormFieldRenderer
              control={control}
              errors={errors}
              fields={FORM_FIELD_TYPES.EDIT_PROFILE}
            />

            <TouchableOpacity
              disabled={isEditing}
              onPress={handleSubmit(onSubmit)}
              className={`bg-brand-primary mt-4 py-3 rounded-xl ${
                isEditing ? "opacity-50" : ""
              }`}
            >
              <Text className="text-white text-center font-lexend-medium text-base">
                {isEditing ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </AppLayout>
  );
}
