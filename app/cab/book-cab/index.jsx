import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as Location from "expo-location";
import Checkbox from "expo-checkbox";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";

const schema = yup.object().shape({
  patient_name: yup.string().required("Patient name is required"),
  patient_phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  emergency_type: yup.string().required("Emergency type is required"),
  address: yup.string().required("Pickup address is required"),
  destination_hospital: yup.string().required("Destination is required"),
  vehicle_type: yup.string().required("Vehicle type is required"),
  confirmation: yup.boolean().oneOf([true], "You must confirm the information"),
});

const BookAmbulanceScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      emergency_type: "medical",
      vehicle_type: "ambulance",
      confirmation: false,
    },
  });

  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);

  const getCurrentLocation = async (fieldName, setLoading) => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const addressList = await Location.reverseGeocodeAsync(location.coords);
      if (addressList.length > 0) {
        const { name, street, city, region } = addressList[0];
        const formatted = `${name || ""} ${street || ""}, ${city || ""}, ${
          region || ""
        }`;
        setValue(fieldName, formatted.trim());
      }
    } catch {
      alert("Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      location: {
        lat: 0,
        lng: 0,
      },
    };
    console.log("Ambulance Request:", payload);
  };

  const fields = [
    {
      name: "patient_name",
      label: "Patient Name",
      placeholder: "Enter patient name",
      type: "text",
    },
    {
      name: "patient_phone",
      label: "Phone Number",
      placeholder: "Enter 10-digit number",
      type: "text",
      keyboardType: "numeric",
    },
    {
      name: "emergency_type",
      label: "Emergency Type",
      type: "select",
      options: [
        { label: "Medical", value: "medical" },
        { label: "Accident", value: "accident" },
        { label: "Maternity", value: "maternity" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "address",
      label: "Pickup Address",
      placeholder: "Tap to fetch location or enter manually",
      type: "text",
    },
    {
      name: "destination_hospital",
      label: "Destination Hospital",
      placeholder: "Enter destination hospital",
      type: "text",
    },
    {
      name: "vehicle_type",
      label: "Vehicle Type",
      type: "select",
      options: [
        { label: "Ambulance", value: "ambulance" },
        { label: "Wheelchair Van", value: "wheelchair_van" },
        { label: "Non-emergency", value: "non_emergency" },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-8">
            <Text className="text-2xl font-lexend-bold text-text-primary mb-2">
              Book a Cab for Emergency Travel
            </Text>
            <Text className="text-base font-lexend text-text-muted mb-6 leading-relaxed">
              Fast, Comfortable & Care-Oriented Rides for Patients
            </Text>

            {/* Form fields */}
            <FormFieldRenderer
              control={control}
              errors={errors}
              fields={fields}
            />

            {/* Confirmation Checkbox */}
            <View className="flex-row items-center space-x-2 mb-6 mt-2">
              <Controller
                control={control}
                name="confirmation"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    value={value}
                    onValueChange={onChange}
                    color={value ? "#FF0000" : undefined} // optional: red color when checked
                    className="mr-4"
                  />
                )}
              />
              <Text className="font-lexend text-text-primary flex-1">
                I confirm all information is correct
              </Text>
            </View>
            {errors.confirmation && (
              <Text className="text-xs text-red-500 mb-4">
                {errors.confirmation.message}
              </Text>
            )}

            {/* Get location buttons */}
            <TouchableOpacity
              className="mb-4"
              onPress={() => getCurrentLocation("address", setLoadingPickup)}
            >
              <Text className="text-brand-primary underline font-lexend">
                📍 Use Current Location as Pickup
              </Text>
            </TouchableOpacity>

            {/* Submit button */}
            <TouchableOpacity
              className="bg-brand-primary py-4 rounded-xl mt-2"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white font-lexend-bold text-center text-base">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BookAmbulanceScreen;
