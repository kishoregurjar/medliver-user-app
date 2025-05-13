"use client";

import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { useAuthUser } from "@/contexts/AuthContext"; // Import AuthContext

export default function useAxios() {
  const { authUser } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  console.log("Auth User in useAxios:", authUser);
  

  /**
   * Make API requests with better flexibility.
   *
   * @param {object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} options.url - API endpoint
   * @param {object|FormData} [options.payload] - Request payload (optional)
   * @param {boolean} [options.authRequired=false] - Whether to include the token
   * @param {object} [options.headers={}] - Custom headers (optional)
   * @param {object} [options.params={}] - Query parameters (optional)
   *
   * @returns {Promise<{ data: any, error: string | null }>} - API response data or error
   */
  const request = async ({
    method,
    url,
    payload = null,
    authRequired = false,
    headers = {},
    params = {},
  }) => {
    setLoading(true);
    setError(null);

    try {
      let requestHeaders = { ...headers };

      // Attach Authorization token if required
      if (authRequired && authUser?.token) {
        requestHeaders.Authorization = `${authUser.token}`;
      }

      let requestData = payload;

      if (payload instanceof FormData) {
        // In React Native, do NOT manually delete Content-Type. Let axios handle it.
        // Axios in RN sets correct boundary automatically if you don't set Content-Type.
      } else if (typeof payload === "object" && payload !== null) {
        requestHeaders["Content-Type"] = "application/json";
      }

      const axiosConfig = {
        method,
        url,
        headers: requestHeaders,
        ...(method === "GET" || method === "DELETE"
          ? { params }
          : { data: requestData }),
      };

      const response = await axiosInstance(axiosConfig);
      setData(response.data);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, data, error };
}
