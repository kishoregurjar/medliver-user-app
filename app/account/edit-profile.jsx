import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import { useAppToast } from "@/hooks/useAppToast";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import SkeletonFormField from "@/components/skeletons/SkeletonFormField";
import { useAuthUser } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import CTAButton from "@/components/common/CTAButton";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { showToast } = useAppToast();
  const { authUser, updateUser: updateUserCallback } = useAuthUser();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    getValues,
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.EDIT_PROFILE),
    mode: "onChange",
  });

  const { showActionSheetWithOptions } = useActionSheet();

  const { request: getProfile, loading: isLoading } = useAxios();
  const { request: editProfile, loading: isEditing } = useAxios();
  const { request: uploadImage } = useAxios();

  const [profilePicture, setProfilePicture] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [uploading, setUploading] = useState(false);

  // Handle unsaved changes on back
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isDirty) return;

      e.preventDefault();
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Cancel", style: "cancel", onPress: () => {} },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isDirty]);

  const openAvatarOptions = () => {
    const options = ["Edit Photo", "Remove Photo", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: "Profile Picture",
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          pickImage(); // open image picker
        } else if (selectedIndex === 1) {
          removeProfilePicture(); // delete profile picture
        }
      }
    );
  };

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

      const defaultValues = {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        height: user.height,
        weight: user.weight,
        bloodGroup: user.bloodGroup,
        dob: user.dob,
      };

      reset(defaultValues);
      setInitialData(defaultValues);
      setProfilePicture(user.profilePicture || null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const pickImage = async () => {
    Alert.alert("Upload Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            showToast("error", "Camera permission required");
            return;
          }

          try {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.5,
              allowsEditing: true,
              aspect: [1, 1],
              base64: false,
            });

            if (
              !result.canceled &&
              result.assets &&
              Array.isArray(result.assets) &&
              result.assets.length > 0 &&
              result.assets[0].uri
            ) {
              await uploadProfileImage(result.assets[0].uri);
            } else {
              console.log("Camera canceled or invalid result", result);
            }
          } catch (err) {
            console.error("Camera error", err);
            showToast("error", "Failed to open camera");
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            showToast("error", "Gallery permission required");
            return;
          }

          try {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.5,
              allowsEditing: true,
              aspect: [1, 1],
              base64: false,
            });

            if (
              !result.canceled &&
              result.assets &&
              Array.isArray(result.assets) &&
              result.assets.length > 0 &&
              result.assets[0].uri
            ) {
              await uploadProfileImage(result.assets[0].uri);
            } else {
              console.log("Gallery canceled or invalid result", result);
            }
          } catch (err) {
            console.error("Gallery error", err);
            showToast("error", "Failed to open gallery");
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload: formData,
    });

    if (error) {
      showToast("error", error || "Failed to upload image");
    } else if (data.status === 200 && data?.data) {
      setProfilePicture(data.data);
      showToast("success", data.message || "Profile picture updated");
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
    } else if (data.status === 200 && data?.data) {
      showToast("success", data.message || "Profile updated successfully!");
      updateUserCallback(data.data);
      setInitialData(data.data);
      updateUser(data.data);
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
            {/* Profile Image Picker */}
            <View className="items-center mb-6 relative">
              {/* Avatar */}
              <View className="w-28 h-28 rounded-full bg-gray-200 justify-center items-center overflow-hidden">
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
              </View>

              {/* Edit Button */}
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full"
                onPress={openAvatarOptions}
                disabled={uploading}
              >
                <Ionicons name="pencil" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <FormFieldRenderer
              control={control}
              errors={errors}
              fields={FORM_FIELD_TYPES.EDIT_PROFILE}
            />

            <CTAButton
              label="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loaderText="Saving..."
              disabled={isEditing || uploading}
              loading={isEditing}
            />
          </>
        )}
      </ScrollView>
    </AppLayout>
  );
}
