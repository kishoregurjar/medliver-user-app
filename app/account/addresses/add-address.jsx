import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as Location from "expo-location";

import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";
import { useAppToast } from "@/hooks/useAppToast";
import CTAButton from "@/components/common/CTAButton";
import { MaterialIcons } from "@expo/vector-icons";

const schema = yup.object().shape({
  address_type: yup.string().required("Address type is required"),
  house_number: yup.string().required("House number is required"),
  street: yup.string(),
  landmark: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string(),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  country: yup.string().required("Country is required"),
});

const addressFields = [
  {
    label: "Address Type",
    name: "address_type",
    placeholder: "Select address type",
    type: "radio",
    options: [
      { label: "Home", value: "home" },
      { label: "Work", value: "work" },
      { label: "Other", value: "other" },
    ],
  },
  {
    label: "House Number",
    name: "house_number",
    placeholder: "Enter house number",
    required: true,
  },
  { label: "Street", name: "street", placeholder: "Enter street" },
  { label: "Landmark", name: "landmark", placeholder: "Enter landmark" },
  { label: "City", name: "city", placeholder: "Enter city", required: true },
  { label: "State", name: "state", placeholder: "Enter state" },
  {
    label: "Pincode",
    name: "pincode",
    placeholder: "Enter pincode",
    keyboardType: "number-pad",
    required: true,
  },
  {
    label: "Country",
    name: "country",
    placeholder: "Enter country",
  },
  {
    label: "Default Address",
    name: "is_default",
    type: "checkbox",
  },
];

export default function AddAddressScreen() {
  const router = useRouter();
  const { showToast } = useAppToast();
  const { request: addAddress, loading: isLoading } = useAxios();
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      is_default: false,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      location: {
        lat: location?.latitude || null,
        long: location?.longitude || null,
      },
    };

    const { data, error } = await addAddress({
      url: "/user/add-address",
      method: "POST",
      authRequired: true,
      payload,
    });

    if (error) {
      showToast("error", error || "Failed to add address");
    } else {
      showToast("success", data.message || "Address added successfully!");
      router.back();
    }
  };

  const [location, setLocation] = useState(null);

  const fetchCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("error", "Permission to access location was denied");
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverse = await Location.reverseGeocodeAsync(loc.coords);
      const address = reverse[0];

      setLocation(loc.coords);

      // Auto-fill form fields
      if (address) {
        setValue("street", address.street || "");
        setValue("city", address.city || "");
        setValue("state", address.region || "");
        setValue("pincode", address.postalCode || "");
        setValue("country", address.country || "");
      }
    } catch (err) {
      console.error("Location error:", err);
      showToast("error", "Failed to get location");
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Add Address" />
      <ScrollView className="px-4 py-6" keyboardShouldPersistTaps="handled">
        <CTAButton
          label="Use Current Location"
          icon={
            <MaterialIcons
              name="my-location"
              size={20}
              color="#B31F24"
              className="mr-2"
            />
          }
          loaderText="Locating..."
          loaderColor={"#B31F24"}
          variant="transparent"
          onPress={fetchCurrentLocation}
          loading={locationLoading}
          disabled={locationLoading}
          textClassName={"text-brand-primary font-lexend-bold text-base"}
          className={"mb-4"}
        />

        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={addressFields}
        />

        <CTAButton
          label="Save Address"
          loaderText="Saving..."
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        />
      </ScrollView>
    </AppLayout>
  );
}
