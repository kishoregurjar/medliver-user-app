import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import useAxios from "@/hooks/useAxios";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    termsOfUse: "Loading Terms of Use...",
    privacyPolicy: "Loading Privacy Policy...",
    appName: "Medlivurr",
    supportEmail: "medlivurr@support.com",
    supportPhone: "+1234567890",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error("Config fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config,
        loading,
        error,
        refetch: fetchConfig,
        termsOfUse: config.termsOfUse,
        privacyPolicy: config.privacyPolicy,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
