import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Location from "expo-location";
import Checkbox from "expo-checkbox";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import AppLayout from "@/components/layouts/AppLayout";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";

const BookAmbulanceScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.BOOK_CAB),
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
  };


  return (
    <AppLayout>
      <View className="py-8">
        <Text className="text-2xl font-lexend-bold text-text-primary mb-2">
          Book a Cab for Emergency Travel
        </Text>
        <Text className="text-base font-lexend text-text-muted mb-6 leading-relaxed">
          Fast, Comfortable & Care-Oriented Rides for Patients
        </Text>

        {/* Form fields */}
        <FormFieldRenderer control={control} errors={errors} fields={FORM_FIELD_TYPES.BOOK_CAB} />

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
    </AppLayout>
  );
};

export default BookAmbulanceScreen;
