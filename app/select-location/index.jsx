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
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useRouter } from "expo-router";

export default function SelectLocationScreen() {
  const router = useRouter();
  const [pincode, setPincode] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState("");

  const handleUseCurrentLocation = async () => {
    setLoadingLocation(true);
    setError("");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address) {
        const formatted = {
          city: address.city || address.subregion || "",
          state: address.region || "",
          pincode: address.postalCode || "",
        };

        setLocationDetails(formatted);

        router.replace({
          pathname: "/home",
          params: {
            selectedAddress: `${formatted.city}, ${formatted.state} - ${formatted.pincode}`,
          },
        });
      } else {
        setError("Could not fetch address from coordinates.");
      }
    } catch (err) {
      setError("Something went wrong while getting location.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleManualSubmit = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    // Optionally: call an API to get real city/state
    const fakeCity = "Indore";
    const fakeState = "Madhya Pradesh";

    router.replace({
      pathname: "/home",
      params: {
        selectedAddress: `${fakeCity}, ${fakeState} - ${pincode}`,
      },
    });
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
          {/* Pincode Input */}
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
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            className="bg-primary px-4 py-3 rounded-xl mb-6"
            onPress={handleManualSubmit}
          >
            <Text className="text-center text-white font-lexend-semibold text-base">
              Submit Pincode
            </Text>
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
            disabled={loadingLocation}
          >
            {loadingLocation ? (
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
          {error ? (
            <Text className="text-red-500 mt-4 text-sm font-lexend">
              {error}
            </Text>
          ) : null}

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
