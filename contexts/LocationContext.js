import React, { createContext, useContext, useEffect, useState } from "react";
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

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useAppToast();

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("user-location");
      const parsedSaved = saved ? JSON.parse(saved) : null;
      if (parsedSaved) {
        setLocation(parsedSaved);
      }
      fetchCurrentLocation(parsedSaved);
    })();
  }, []);

  const fetchCurrentLocation = async (prevStored) => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("error", "Permission denied for location");
        return;
      }

      const coords = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync(coords.coords);

      if (!address) throw new Error("Could not reverse geocode address.");

      const newLocation = formatLocation(address);

      // Only update if different
      await AsyncStorage.setItem("user-location", JSON.stringify(newLocation));
      setLocation(newLocation);
      if (JSON.stringify(newLocation) !== JSON.stringify(prevStored)) {
      }
    } catch (err) {
      console.error("Location error:", err);
      showToast("error", "Location fetch failed");
    } finally {
      setLoading(false);
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
    await AsyncStorage.setItem("user-location", JSON.stringify(locationObject));
    setLocation(locationObject);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        fetchCurrentLocation,
        fetchLocationFromPincode,
        updateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => useContext(LocationContext);
