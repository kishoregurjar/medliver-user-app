import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppSpinner } from "@/components/common/AppSpinner";
import ROUTE_PATH from "@/routes/route.constants";

const AuthContext = createContext(null);

export const useAuthUser = () => useContext(AuthContext);

const defaultAuthUser = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(defaultAuthUser);
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
    const { token } = response;

    const userData = {
      isAuthenticated: true,
      user: response,
      token,
    };

    setAuthUser(userData);

    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save auth user:", error);
      router.replace(ROUTE_PATH.AUTH.LOGIN);
    }
  };

  const logout = async () => {
    setAuthUser(defaultAuthUser);
    try {
      await AsyncStorage.removeItem("authUser");
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Failed to remove auth user:", error);
    }
    router.replace(ROUTE_PATH.AUTH.LOGIN);
  };

  const updateUser = async (newUserData) => {
    if (!newUserData) return;

    setAuthUser((prev) => {
      if (!prev) return defaultAuthUser;

      const updatedUser = {
        ...prev,
        user: newUserData,
      };

      AsyncStorage.setItem("authUser", JSON.stringify(updatedUser)).catch(
        (err) => console.error("Failed to update user in storage:", err)
      );

      return updatedUser;
    });
  };

  const value = useMemo(
    () => ({
      authUser,
      login,
      logout,
      updateUser,
    }),
    [authUser]
  );

  if (!isAuthLoaded) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-white">
        <Text className="text-xl font-lexend-bold text-gray-600 mb-5">
          Please Wait...
        </Text>
        <AppSpinner size="large" color="#B31F24" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
