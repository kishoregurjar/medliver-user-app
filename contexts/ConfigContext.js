import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import useAxios from "@/hooks/useAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConfigContext = createContext();

const ONBOARDING_DONE_STORAGE_KEY = "onboarding-done";

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    termsOfUse: "Loading Terms of Use...",
    privacyPolicy: "Loading Privacy Policy...",
    appName: "Medlivurr",
    supportEmail: "medlivurr@support.com",
    supportPhone: "+1234567890",
  });
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { request } = useAxios();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [termsRes, privacyRes] = await Promise.all([
        request({
          method: "GET",
          url: "/user/get-terms-and-conditions?userType=customer",
          authRequired: false,
        }),
        request({
          method: "GET",
          url: "/user/get-privacy-policy?userType=customer",
          authRequired: false,
        }),
      ]);

      let termsContent =
        termsRes?.data?.data?.policy || "No Terms of Use available.";
      let privacyContent =
        privacyRes?.data?.data?.policy || "No Privacy Policy available.";

      setConfig((prev) => ({
        ...prev,
        termsOfUse: termsContent,
        privacyPolicy: privacyContent,
      }));
    } catch (err) {
      setError("Failed to load static config");
      setConfig((prev) => ({
        ...prev,
        termsOfUse: "Unable to load Terms of Use.",
        privacyPolicy: "Unable to load Privacy Policy.",
      }));

      console.error("Config fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem(ONBOARDING_DONE_STORAGE_KEY);
      if (seen === "true") setOnboardingDone(true);
    };
    checkOnboarding();
  }, []);

  const markOnboardingDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_DONE_STORAGE_KEY, "true");
    setOnboardingDone(true);
  };

  useEffect(() => {
    if (!hasLoadedOnce && !loading) setHasLoadedOnce(true);
  }, [loading]);

  const value = useMemo(
    () => ({
      config,
      loading,
      error,
      refetch: fetchConfig,
      onboardingDone,
      markOnboardingDone,
    }),
    [config, loading, error, fetchConfig, onboardingDone]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
