import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, Linking, Platform } from "react-native"; // ⬅️ import this

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useAppToast } from "@/hooks/useAppToast";

const LocationContext = createContext(null);

const formatLocation = (address) => ({
  city: address.city || address.subregion || "",
  region: address.region || "",
  district: address.district || null,
  country: address.country || "",
  isoCountryCode: address.isoCountryCode || "",
  postalCode: address.postalCode || "",
  name: address.name || "",
  street: address.street || "",
  streetNumber: address.streetNumber || "",
  subregion: address.subregion || "",
  formattedAddress: `${address.name || ""} ${address.street || ""}, ${
    address.city || ""
  }, ${address.region || ""}, ${address.postalCode || ""}, ${
    address.country || ""
  }`,
  timezone: null,
});

const USER_LOCATION_STORAGE_KEY = "user-location";

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const { showToast } = useAppToast();

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(USER_LOCATION_STORAGE_KEY);
      const parsedSaved = saved ? JSON.parse(saved) : null;
      if (parsedSaved) setLocation(parsedSaved);

      await fetchCurrentLocation(parsedSaved); // ⬅️ make this await
      startPeriodicLocationCheck();
    })();

    return () => stopPeriodicLocationCheck();
  }, []);

  const fetchCurrentLocation = async (prevStored = null) => {
    try {
      setLoading(true);
      let { status, canAskAgain } =
        await Location.getForegroundPermissionsAsync();

      // 🔁 Prompt again if user can still be asked
      if (status !== "granted" && canAskAgain) {
        const permissionResponse =
          await Location.requestForegroundPermissionsAsync();
        status = permissionResponse.status;
        canAskAgain = permissionResponse.canAskAgain;
      }

      // ❌ User denied permanently (Don't Ask Again on Android)
      if (status !== "granted") {
        if (!canAskAgain) {
          Alert.alert(
            "Permission Blocked",
            "You've blocked location access. Please enable it from app settings.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        } else {
          showToast("warning", "Location permission not granted");
        }
        return;
      }

      const coords = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync(coords.coords);

      if (!address) throw new Error("Could not reverse geocode address.");
      const newLocation = formatLocation(address);

      if (JSON.stringify(newLocation) !== JSON.stringify(prevStored)) {
        await AsyncStorage.setItem(
          USER_LOCATION_STORAGE_KEY,
          JSON.stringify(newLocation)
        );
        setLocation(newLocation);
      }
    } catch (err) {
      console.error("Location error:", err);
      showToast("error", "Location fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const startPeriodicLocationCheck = () => {
    stopPeriodicLocationCheck(); // 🧼 clear any existing interval before starting new
    intervalRef.current = setInterval(async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } =
            await Location.requestForegroundPermissionsAsync();
          if (newStatus === "granted") {
            await fetchCurrentLocation();
          } else {
            showToast("warning", "Location permission not granted");
          }
        } else {
          await fetchCurrentLocation();
        }
      } catch (err) {
        console.error("Periodic location check error:", err);
      }
    }, 10 * 60 * 1000); // ⏱️ 10 minutes
  };

  const stopPeriodicLocationCheck = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fetchLocationFromPincode = async (pincode) => {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    const postOffice = data?.[0]?.PostOffice?.[0];
    if (!postOffice) throw new Error("Invalid pincode");

    return {
      city: postOffice.District,
      region: postOffice.State,
      district: null,
      country: "India",
      isoCountryCode: "IN",
      postalCode: postOffice.Pincode,
      name: null,
      street: null,
      streetNumber: null,
      subregion: null,
      formattedAddress: `${postOffice.District}, ${postOffice.State}, ${postOffice.Pincode}`,
      timezone: null,
    };
  };

  const updateLocation = async (locationObject) => {
    await AsyncStorage.setItem(
      USER_LOCATION_STORAGE_KEY,
      JSON.stringify(locationObject)
    );
    setLocation(locationObject);
  };

  const value = useMemo(
    () => ({
      location,
      loading,
      fetchCurrentLocation,
      fetchLocationFromPincode,
      updateLocation,
      startPeriodicLocationCheck,
      stopPeriodicLocationCheck,
    }),
    [location, loading]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => useContext(LocationContext);
