import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useRouter } from "expo-router";
import { useUserLocation } from "@/contexts/LocationContext";

export default function SelectLocationScreen() {
  const router = useRouter();
  const [pincode, setPincode] = useState("");
  const [loadingManualSubmit, setLoadingManualSubmit] = useState(false);
  const [error, setError] = useState("");

  const {
    location,
    loading: locationLoading,
    fetchCurrentLocation,
    fetchLocationFromPincode,
    updateLocation,
  } = useUserLocation();

  const navigateToHome = (locationObject) => {
    updateLocation(locationObject);
    router.replace({
      pathname: "/home",
    });
  };

  const handleManualSubmit = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setError("");
    setLoadingManualSubmit(true);

    try {
      const locationFromPin = await fetchLocationFromPincode(pincode);
      navigateToHome(locationFromPin);
    } catch (err) {
      setError(err.message || "Failed to fetch location from pincode.");
    } finally {
      setLoadingManualSubmit(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setError("");

    try {
      await fetchCurrentLocation(); // context handles permission, geocode, and update
      if (location?.postalCode) {
        navigateToHome(location);
      } else {
        setError("Failed to get a valid location. Try manual entry.");
      }
    } catch (err) {
      console.error("Location fetch error:", err);
      setError("Unable to use current location.");
    }
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack
        showBackButton
        title="Select Location"
        clearStack
        backTo="/home"
      />

      <View className="flex-1 justify-start mt-6">
        <Text className="text-base font-lexend-semibold mb-2 text-gray-700">
          Enter Pincode
        </Text>

        {/* Pincode Input */}
        <View className="flex-row items-center bg-white border border-background-soft px-4 py-3 rounded-xl mb-4">
          <Ionicons name="location-outline" size={20} color="#888" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Enter 6-digit pincode"
            keyboardType="number-pad"
            value={pincode}
            maxLength={6}
            onChangeText={(text) => {
              setPincode(text);
              setError("");
            }}
            editable={!loadingManualSubmit && !locationLoading}
            returnKeyType="done"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="px-4 py-3 rounded-xl mb-6 bg-primary"
          onPress={handleManualSubmit}
          disabled={loadingManualSubmit || locationLoading}
        >
          {loadingManualSubmit ? (
            <ActivityIndicator color="#B31F24" />
          ) : (
            <Text className="text-center text-brand-primary font-lexend-semibold text-base">
              Submit Pincode
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-400 text-base font-lexend">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Use Current Location */}
        <TouchableOpacity
          className="flex-row items-center justify-center border border-primary rounded-xl px-4 py-3"
          onPress={handleUseCurrentLocation}
          disabled={loadingManualSubmit || locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator color="#B31F24" />
          ) : (
            <>
              <Ionicons name="navigate" size={20} color="#B31F24" />
              <Text className="ml-2 text-brand-primary font-lexend-semibold">
                Use My Current Location
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error && (
          <Text className="text-brand-primary mt-4 text-sm font-lexend">
            {error}
          </Text>
        )}

        {/* Location Preview */}
        {location?.city && (
          <View className="mt-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <Text className="text-green-700 font-lexend">
              Selected: {location.city}, {location.region} -{" "}
              {location.postalCode}
            </Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
}
