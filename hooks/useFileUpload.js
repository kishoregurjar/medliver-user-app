import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { useAuthUser } from "@/contexts/AuthContext"; // Optional auth context

export default function useFileUpload({
  url,
  authRequired = false,
  allowedTypes = [],
  fieldName = "files",
  maxFileSize = 5,
  maxFiles = 5,
}) {
  const { authUser } = useAuthUser?.() ?? {};
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    const previews = selectedFiles.map((file) => ({
      name: file.name,
      uri: file.uri,
      type: file.mimeType?.startsWith("image/") ? "image" : "icon",
    }));
    setFilePreviews(previews);
  }, [selectedFiles]);

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const validateFiles = async (files) => {
    if (files.length + selectedFiles.length > maxFiles) {
      Alert.alert("Limit Reached", `Max ${maxFiles} files allowed.`);
      return false;
    }

    for (let file of files) {
      if (!allowedTypes.includes(file.mimeType)) {
        Alert.alert("Unsupported Type", `${file.name} type is not allowed.`);
        return false;
      }
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      const sizeMB = fileInfo.size / (1024 * 1024);
      if (sizeMB > maxFileSize) {
        Alert.alert("File Too Large", `${file.name} exceeds ${maxFileSize}MB`);
        return false;
      }
    }
    return true;
  };

  const uploadFile = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert("No Files", "Please select files to upload.");
      return { data: null, error: "No files" };
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append(fieldName, {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });
      });

      const response = await axios.post(
        `${
          process.env.EXPO_PUBLIC_API_URL ||
          "https://medliver-backend-production.up.railway.app/api/v1"
        }${url}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(authRequired && authUser?.token
              ? { Authorization: authUser.token }
              : {}),
          },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      if (response.data.status === 200) {
        Alert.alert("Success", response.data.message);
        clearFiles();
        return { data: response.data, error: null };
      } else {
        Alert.alert("Error", response.data.message);
        return { data: null, error: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Upload failed";
      Alert.alert("Upload Error", message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return {
    uploadFile,
    loading,
    progress,
    selectedFiles,
    filePreviews,
    setSelectedFiles,
    removeFile,
    clearFiles,
    validateFiles,
  };
}
