"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/libs/route-path";

const AuthContext = createContext();

export const useAuthUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const loadAuthUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("authUser");
        if (storedUser) {
          setAuthUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load auth user:", error);
      } finally {
        setIsAuthLoaded(true);
      }
    };

    loadAuthUser();
  }, []);

  const login = async (response) => {
    const { token, role, permissions } = response;
    const userData = {
      user: response,
      isAuthenticated: true,
      token,
      role,
      permissions,
    };
    setAuthUser(userData);
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save auth user:", error);
    }
  };

  const logout = async () => {
    setAuthUser(null);
    try {
      await AsyncStorage.removeItem("authUser");
    } catch (error) {
      console.error("Failed to remove auth user:", error);
    }
    router.push(ROUTE_PATH.AUTH.LOGIN);
  };

  const updateUser = (user) => {
    setAuthUser((prev) => ({ ...prev, user }));
  };

  if (!isAuthLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Please Wait...</Text>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ authUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 20,
  },
});
