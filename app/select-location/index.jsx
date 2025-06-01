import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useRouter } from "expo-router";

export default function SelectLocationScreen() {
  const router = useRouter();
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState("");

  const saveLocationToStorage = async (location) => {
    try {
      await AsyncStorage.setItem("user_location", JSON.stringify(location));
    } catch (e) {
      console.error("Failed to save location", e);
    }
  };

  const navigateToHome = (location) => {
    saveLocationToStorage(location);
    router.replace({
      pathname: "/home",
      params: {
        selectedAddress: `${location.city}, ${location.state} - ${location.pincode}`,
      },
    });
  };

  const fetchLocationFromPincode = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const postOffice = data?.[0]?.PostOffice?.[0];
      if (postOffice) {
        return {
          city: postOffice.District,
          state: postOffice.State,
          pincode: postOffice.Pincode,
        };
      } else {
        throw new Error("Invalid pincode.");
      }
    } catch (e) {
      throw new Error("Failed to fetch location from pincode.");
    }
  };

  const handleManualSubmit = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const location = await fetchLocationFromPincode(pincode);
      setLocationDetails(location);
      navigateToHome(location);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    setError("");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied.");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address?.postalCode) {
        const location = await fetchLocationFromPincode(address.postalCode);
        setLocationDetails(location);
        navigateToHome(location);
      } else {
        setError("Could not fetch postal code from location.");
      }
    } catch (err) {
      setError("Failed to get current location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout scroll={false}>
      <SafeAreaView className="flex-1 px-4">
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
              editable={!loading}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            className={`px-4 py-3 rounded-xl mb-6 ${
              loading ? "bg-gray-400" : "bg-primary"
            }`}
            onPress={handleManualSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-lexend-semibold text-base">
                Submit Pincode
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-2 text-gray-400 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Use Current Location */}
          <TouchableOpacity
            className="flex-row items-center justify-center border border-primary rounded-xl px-4 py-3"
            onPress={handleUseCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#22c55e" />
            ) : (
              <>
                <Ionicons name="navigate" size={20} color="#22c55e" />
                <Text className="ml-2 text-primary font-lexend-semibold">
                  Use My Current Location
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Error */}
          {error && (
            <Text className="text-red-500 mt-4 text-sm font-lexend">
              {error}
            </Text>
          )}

          {/* Location Preview */}
          {locationDetails && (
            <View className="mt-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <Text className="text-green-700 font-lexend">
                Selected: {locationDetails.city}, {locationDetails.state} -{" "}
                {locationDetails.pincode}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </AppLayout>
  );
}
