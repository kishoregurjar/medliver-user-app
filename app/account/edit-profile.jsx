import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import CTAButton from "@/components/common/CTAButton";
import LoadingDots from "@/components/common/LoadingDots";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";

import useAxios from "@/hooks/useAxios";
import { useAppToast } from "@/hooks/useAppToast";
import { useAuthUser } from "@/contexts/AuthContext";

import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { showToast } = useAppToast();
  const { authUser, updateUser: updateUserContext } = useAuthUser();
  const { showActionSheetWithOptions } = useActionSheet();

  const { control, handleSubmit, reset, formState, getValues } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.EDIT_PROFILE),
    mode: "onChange",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { request: getProfile, loading: isLoading } = useAxios();
  const { request: editProfile, loading: isEditing } = useAxios();
  const { request: uploadImage } = useAxios();

  // Handle unsaved changes warning
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!formState.isDirty) return;
      e.preventDefault();
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, formState.isDirty]);

  // Fetch profile
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

    const user = data?.data;
    if (user) {
      const defaultValues = {
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        height: user.height || "",
        weight: user.weight || "",
        bloodGroup: user.bloodGroup || "",
      };
      reset(defaultValues);
      setProfilePicture(user.profilePicture ?? null);
    }
  };

  useFocusEffect(useCallback(() => void fetchUserProfile(), []));

  const openAvatarOptions = () => {
    const options = ["Change Photo", "Remove Photo", "Cancel"];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: "Profile Picture",
      },
      (selectedIndex) => {
        if (selectedIndex === 0) pickImage();
        else if (selectedIndex === 1) setProfilePicture(null);
      }
    );
  };

  const pickImage = async () => {
    Alert.alert("Upload Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: () => handleImagePick("camera"),
      },
      {
        text: "Gallery",
        onPress: () => handleImagePick("gallery"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImagePick = async (source) => {
    try {
      const permission = await (source === "camera"
        ? ImagePicker.requestCameraPermissionsAsync()
        : ImagePicker.requestMediaLibraryPermissionsAsync());

      if (permission.status !== "granted") {
        showToast("error", `${source} permission denied`);
        return;
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.5,
              allowsEditing: true,
              aspect: [1, 1],
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.5,
              allowsEditing: true,
              aspect: [1, 1],
            });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Image pick error:", err);
      showToast("error", "Something went wrong");
    }
  };

  const uploadProfileImage = async (uri) => {
    setUploading(true);

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
      headers: { "Content-Type": "multipart/form-data" },
      payload: formData,
    });

    if (error) {
      showToast("error", "Failed to upload image");
    } else {
      setProfilePicture(data?.data);
      showToast("success", "Profile picture updated");
    }

    setUploading(false);
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
      showToast("success", data?.message || "Profile updated");
      updateUserContext(data?.data);
    }
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack title="Edit Profile" showBackButton />

      {isLoading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots
            title={"Loading profile..."}
            subtitle={"Please wait..."}
          />
        </View>
      ) : (
        <>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar */}
            <View className="items-center mb-6 relative">
              <View className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 justify-center items-center">
                {uploading ? (
                  <ActivityIndicator size="large" color="#B31F24" />
                ) : profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    className="w-28 h-28 rounded-full"
                  />
                ) : (
                  <Text className="text-gray-500">Add Image</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={openAvatarOptions}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm"
              >
                <Ionicons name="pencil" size={18} color="#B31F24" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <FormFieldRenderer
              control={control}
              errors={formState.errors}
              fields={FORM_FIELD_TYPES.EDIT_PROFILE}
            />

            <CTAButton
              label="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loading={isEditing}
              loaderText="Saving..."
              disabled={isEditing || uploading}
            />
          </ScrollView>
        </>
      )}
    </AppLayout>
  );
}
