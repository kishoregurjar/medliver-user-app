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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import Checkbox from "expo-checkbox";
import FormLabel from "@/components/inputs/FormLabel";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import FormError from "@/components/inputs/FormError";

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
});

const BookAmbulanceScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      emergency_type: "medical",
      vehicle_type: "ambulance",
    },
  });

  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const getCurrentLocation = async (fieldName, setLoading) => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("Current Location:", location.coords);
      const addressList = await Location.reverseGeocodeAsync(location.coords);
      if (addressList.length > 0) {
        const { name, street, city, region } = addressList[0];
        const formatted = `${name || ""} ${street || ""}, ${city || ""}, ${
          region || ""
        }`;
        console.log("Current Location:", formatted);

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

  const renderInput = ({
    name,
    label,
    placeholder,
    multiline = false,
    keyboardType = "default",
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="mb-5">
          <FormLabel label={label} />
          <FormStyledInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            keyboardType={keyboardType}
          />
          <FormError error={errors[name]?.message} />
        </View>
      )}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-8">
            <Text className="text-2xl font-lexend-bold text-app-color-black mb-2">
              Book a Cab for Emergency Travel
            </Text>
            <Text className="text-base text-app-color-grey mb-6 leading-relaxed">
              Fast, Comfortable & Care-Oriented Rides for Patients
            </Text>

            {renderInput({
              name: "patient_name",
              label: "Patient Name",
              placeholder: "Enter patient name",
            })}

            {renderInput({
              name: "patient_phone",
              label: "Phone Number",
              placeholder: "Enter 10-digit number",
              keyboardType: "numeric",
            })}

            {/* Emergency Type */}
            <Controller
              control={control}
              name="emergency_type"
              render={({ field: { onChange, value } }) => (
                <View className="mb-5">
                  <FormLabel label="Emergency Type" />
                  <View className="border border-gray-300 rounded-lg">
                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item label="Select Emergency Type" value="" />
                      <Picker.Item label="Medical" value="medical" />
                      <Picker.Item label="Accident" value="accident" />
                      <Picker.Item label="Fire" value="fire" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                  <FormError error={errors.emergency_type?.message} />
                </View>
              )}
            />

            {/* Pickup Address */}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-5">
                  <View className="flex-row justify-between items-center mb-1">
                    <FormLabel label="Pickup Address" className="mb-0" />
                    <TouchableOpacity
                      onPress={() =>
                        getCurrentLocation("address", setLoadingPickup)
                      }
                    >
                      <Text className="text-blue-600 text-xs font-medium">
                        {loadingPickup
                          ? "Detecting..."
                          : "Use current location"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <FormStyledInput
                    placeholder="Enter pickup location"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                  <FormError error={errors.address?.message} />
                </View>
              )}
            />

            {/* Destination Hospital */}
            <Controller
              control={control}
              name="destination_hospital"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-5">
                  <View className="flex-row justify-between items-center mb-1">
                    <FormLabel label="Destination Hospital" className="mb-0" />
                    <TouchableOpacity
                      onPress={() =>
                        getCurrentLocation(
                          "destination_hospital",
                          setLoadingDestination
                        )
                      }
                    >
                      <Text className="text-blue-600 text-xs font-medium">
                        {loadingDestination
                          ? "Detecting..."
                          : "Use current location"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <FormStyledInput
                    placeholder="Enter destination"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                  <FormError error={errors.destination_hospital?.message} />
                </View>
              )}
            />

            {/* Vehicle Type */}
            <Controller
              control={control}
              name="vehicle_type"
              render={({ field: { onChange, value } }) => (
                <View className="mb-6">
                  <FormLabel label="Vehicle Type" />
                  <View className="border border-gray-300 rounded-lg">
                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item label="Select Vehicle Type" value="" />
                      <Picker.Item label="Ambulance" value="ambulance" />
                      <Picker.Item label="Fire Truck" value="fire_truck" />
                      <Picker.Item label="Rescue Van" value="rescue_van" />
                    </Picker>
                  </View>
                  <FormError error={errors.vehicle_type?.message} />
                </View>
              )}
            />

            {/* Confirmation */}
            <View className="flex-row items-start mb-6">
              <Checkbox
                value={confirmationChecked}
                onValueChange={setConfirmationChecked}
                color={confirmationChecked ? "#5C59FF" : undefined}
              />
              <Text className="ml-2 text-sm text-[#6E6A7C] leading-relaxed">
                I confirm this booking is non-medical and for patient transport
                only.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!confirmationChecked}
              className={`py-4 rounded-xl ${
                confirmationChecked ? "bg-app-color-red" : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-center text-base font-semibold">
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
