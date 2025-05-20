import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "@react-navigation/native";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import { useAppToast } from "@/hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import SkeletonFormField from "@/components/skeletons/SkeletonFormField";
import { useAuthUser } from "@/contexts/AuthContext";

export default function EditProfileScreen() {
  const { showToast } = useAppToast();
  const { authUser, updateUser } = useAuthUser();

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
  const { request: uploadImage } = useAxios();

  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchUserProfile = async () => {
    const { data, error } = await getProfile({
      url: "/user/get-user-details",
      method: "GET",
      authRequired: true,
    });

    if (error) {
      showToast("error", error || "Failed to load profile");
      return;
    }

    if (data.status === 200 && data?.data) {
      const user = data.data;

      reset({
        fullName: user.fullName || null,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        height: user.height || null,
        weight: user.weight || null,
        bloodGroup: user.bloodGroup || null,
      });
      setProfilePicture(user.profilePicture || null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showToast("error", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      await uploadProfileImage(localUri);
    }
  };

  const uploadProfileImage = async (uri) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    const { data, error } = await uploadImage({
      url: "/user/update-user-profile-picture",
      method: "POST",
      authRequired: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload: formData,
    });

    if (error) {
      showToast("error", error || "Failed to upload image");
      return;
    }

    if (data.status === 200 && data?.data) {
      setProfilePicture(data.data); // Expecting URL in data.data
      showToast("success", data.message || "Profile picture updated");
    }
  };

  const onSubmit = async (payload) => {
    const body = {
      ...payload,
      profilePicture,
    };

    const { data, error } = await editProfile({
      url: "/user/update-user-profile",
      method: "PATCH",
      authRequired: true,
      payload: body,
    });

    if (error) {
      showToast("error", error || "Failed to update profile");
    } else {
      if (data.status === 200) {
        console.log(data.data, data.message);

        // updateUser(data.data);
        showToast("success", data.message || "Profile updated successfully!");
      }
    }
  };

  return (
    <AppLayout>
      <HeaderWithBack title="Edit Profile" showBackButton />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          FORM_FIELD_TYPES.EDIT_PROFILE.map((_, index) => (
            <SkeletonFormField key={index} />
          ))
        ) : (
          <>
            <View className="items-center mb-6">
              <TouchableOpacity
                onPress={pickImage}
                disabled={uploading}
                className="w-28 h-28 rounded-full bg-gray-200 justify-center items-center overflow-hidden"
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#5C59FF" />
                ) : profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    className="w-28 h-28 rounded-full"
                  />
                ) : (
                  <Text className="text-gray-500">Add Image</Text>
                )}
              </TouchableOpacity>
            </View>

            <FormFieldRenderer
              control={control}
              errors={errors}
              fields={FORM_FIELD_TYPES.EDIT_PROFILE}
            />

            <TouchableOpacity
              disabled={isEditing || uploading}
              onPress={handleSubmit(onSubmit)}
              className={`bg-brand-primary mt-4 py-3 rounded-xl ${
                isEditing || uploading ? "opacity-50" : ""
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
