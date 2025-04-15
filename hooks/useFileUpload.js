"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthUser } from "@/contexts/AuthContext";
import { showToast } from "@/components/_ui/toast-utils";

export default function useFileUpload({
  url,
  authRequired = false,
  allowedTypes = [],
  maxFileSize = 5,
  maxFiles = 5,
}) {
  const { authUser } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const previews = selectedFiles.map((file) => ({
        name: file.name,
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : getFileIcon(file),
        type: file.type.startsWith("image/") ? "image" : "icon",
      }));

      setFilePreviews(previews);

      return () => {
        previews
          .filter((preview) => preview.type === "image")
          .forEach((preview) => URL.revokeObjectURL(preview.url));
      };
    } else {
      setFilePreviews([]);
    }
  }, [selectedFiles]);

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const validateFiles = (files) => {
    if (files.length > maxFiles) {
      showToast("error", `You can upload up to ${maxFiles} files.`);
      return false;
    }

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        showToast("error", `File type not allowed: ${file.name}`);
        return false;
      }
      if (file.size > maxFileSize * 1024 * 1024) {
        showToast("error", `${file.name} exceeds ${maxFileSize}MB.`);
        return false;
      }
    }

    return true;
  };

  const uploadFile = async () => {
    console.log("Selected Files:", selectedFiles);

    if (selectedFiles.length === 0) {
      showToast("error", "No files selected.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      console.log("FormData prepared:", [...formData.entries()]); // Debugging log

      const config = {
        method: "POST",
        url: `http://localhost:4002/api/v1${url}`,
        data: formData,
        headers: {
          ...(authRequired && authUser?.token
            ? { Authorization: `${authUser.token}` }
            : {}),
        },
        onUploadProgress: (event) => {
          const percentCompleted = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percentCompleted);
        },
      };

      const response = await axios(config);
      console.log("Response received:", response); // Debugging log

      if (response.data.status === 200) {
        showToast("success", response.data.message);
        clearFiles();
        return { data: response.data, error: null };
      } else {
        showToast("error", response.data.message);
        return { data: null, error: response.data.message };
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.response?.data?.message || "Upload failed";
      setError(errorMessage);
      showToast("error", errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return {
    uploadFile,
    loading,
    progress,
    error,
    selectedFiles,
    filePreviews,
    removeFile,
    clearFiles,
    setSelectedFiles,
    validateFiles,
  };
}

function getFileIcon(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const fileIcons = {
    pdf: "/icons/pdf.svg",
    doc: "/icons/doc.svg",
    docx: "/icons/doc.svg",
    xls: "/icons/xls.svg",
    xlsx: "/icons/xls.svg",
    csv: "/icons/csv.svg",
    default: "/icons/file.svg",
  };

  return fileIcons[ext] || fileIcons.default;
}
