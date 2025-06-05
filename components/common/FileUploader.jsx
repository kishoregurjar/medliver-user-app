import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import mime from "mime"; // Ensure it's installed

import useFileUpload from "@/hooks/useFileUpload";
import { useAuthUser } from "@/contexts/AuthContext";

const FilePreviewItem = ({ item, index, onPreview, onRemove }) => (
  <View className="mr-3 relative">
    <TouchableOpacity onPress={() => onPreview(item.uri)}>
      {item.type === "image" ? (
        <Image source={{ uri: item.uri }} className="w-20 h-20 rounded-lg" />
      ) : (
        <View className="w-20 h-20 bg-gray-200 rounded-lg justify-center items-center">
          <Text className="text-gray-600">{item.name.split(".").pop()}</Text>
        </View>
      )}
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => onRemove(index)}
      className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full justify-center items-center"
    >
      <Text className="text-white text-xs">×</Text>
    </TouchableOpacity>
  </View>
);

export default function FileUploader({
  url = "/file/upload",
  authRequired = true,
  allowedTypes = ["image/png", "image/jpeg", "application/pdf", "text/csv"],
  fieldName = "files",
  maxFileSize = 5,
  maxFiles = 5,
  onSuccess,
  onError,
}) {
  const {
    uploadFile,
    loading,
    progress,
    filePreviews,
    removeFile,
    clearFiles,
    setSelectedFiles,
    selectedFiles,
    validateFiles,
  } = useFileUpload({
    url,
    authRequired,
    allowedTypes,
    fieldName,
    maxFileSize,
    maxFiles,
  });

  const { authUser } = useAuthUser();

  const [previewImage, setPreviewImage] = useState(null);

  const handlePickFile = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!res.canceled && res.assets?.length > 0) {
        const picked = res.assets[0];

        const file = {
          uri: picked.uri,
          name: picked.name,
          mimeType: picked.mimeType ?? mime.getType(picked.name),
        };

        const valid = await validateFiles([file]);
        if (valid) {
          setSelectedFiles((prev) => [...prev, file]);
        }
      }
    } catch (err) {
      console.error("File picking error:", err);
      Alert.alert("Error", "Failed to pick the file.");
    }
  }, [allowedTypes, validateFiles, setSelectedFiles]);

  const handleUpload = useCallback(async () => {
    if (!authUser.isAuthenticated ) {
      Alert.alert("Unauthorized", "You must be logged in to upload.");
      return;
    }
    const { data, error } = await uploadFile();
    if (data && onSuccess) onSuccess(data);
    if (error && onError) onError(error);
  }, [uploadFile, onSuccess, onError]);

  return (
    <View className="p-4">
      {/* Upload Button */}
      <TouchableOpacity
        onPress={handlePickFile}
        className="bg-brand-primary/20 rounded-lg py-3 px-4 flex-row items-center justify-center"
      >
        <Ionicons
          name="cloud-upload"
          size={24}
          color="#B31F24"
          className="mr-5 opacity-80"
        />
        <Text className="text-base font-lexend-semibold text-brand-primary/80">
          Upload File Picker
        </Text>
      </TouchableOpacity>

      {/* Preview List */}
      <FlatList
        horizontal
        data={filePreviews}
        contentContainerStyle={{ marginTop: 12 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <FilePreviewItem
            item={item}
            index={index}
            onPreview={setPreviewImage}
            onRemove={removeFile}
          />
        )}
      />

      {/* Progress Indicator */}
      {progress > 0 && (
        <Text className="mt-2 text-sm text-text-muted">
          Progress: {progress}%
        </Text>
      )}

      {/* Upload & Clear Actions */}
      <View className="flex-row justify-center items-center mt-4 gap-4">
        <TouchableOpacity
          disabled={loading || selectedFiles.length === 0}
          onPress={handleUpload}
          className={`py-3 px-5 rounded-lg ${
            loading || selectedFiles.length === 0
              ? "bg-gray-400"
              : "bg-brand-primary"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-lexend-semibold">Upload</Text>
          )}
        </TouchableOpacity>

        {selectedFiles.length > 0 && (
          <TouchableOpacity
            onPress={clearFiles}
            className="border border-gray-400 py-3 px-5 rounded-lg"
          >
            <Text className="text-text-muted font-lexend-semibold">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <View className="flex-1 bg-black/90 justify-center items-center relative">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setPreviewImage(null)}
            className="absolute top-12 right-6 z-10 bg-black/60 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xl">×</Text>
          </TouchableOpacity>

          {/* Image Preview */}
          <Image
            source={{ uri: previewImage }}
            className="w-[90%] h-[75%] rounded-xl"
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}
