import React, { useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import { useAppToast } from "@/hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";

// ✅ Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Enter full name" },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email",
    keyboardType: "email-address",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter phone number",
    keyboardType: "numeric",
  },
  { name: "height", label: "Height", placeholder: "e.g. 170 cm" },
  { name: "weight", label: "Weight", placeholder: "e.g. 70 kg" },
  {
    name: "bloodGroup",
    label: "Blood Group",
    type: "select",
    options: [
      { label: "A+", value: "A+" },
      { label: "A-", value: "A-" },
      { label: "B+", value: "B+" },
      { label: "B-", value: "B-" },
      { label: "O+", value: "O+" },
      { label: "O-", value: "O-" },
      { label: "AB+", value: "AB+" },
      { label: "AB-", value: "AB-" },
    ],
  },
];

export default function EditProfileScreen() {
  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
            {/* skeleton with nativewind */}
            <View className="animate-pulse">
              {fields.map((_, index) => (
                <View key={index} className="my-2">
                  <View className="h-4 bg-gray-300 rounded w-32 mb-2" />
                  <View className="h-12 bg-gray-200 rounded" />
                </View>
              ))}
            </View>{" "}
          </>
        ) : (
          <>
            <FormFieldRenderer
              control={control}
              errors={errors}
              fields={fields}
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
