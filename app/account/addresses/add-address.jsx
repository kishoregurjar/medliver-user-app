import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Location from "expo-location";

import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";
import { useAppToast } from "@/hooks/useAppToast";
import CTAButton from "@/components/common/CTAButton";
import { MaterialIcons } from "@expo/vector-icons";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";

export default function AddAddressScreen() {
  const router = useRouter();
  const { showToast } = useAppToast();
  const { request: addAddress, loading: isLoading } = useAxios();
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      is_default: false,
    },
    resolver: yupResolver(FORM_VALIDATIONS.USER_ADD_ADDRESS),
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
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Add Address" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
          fields={FORM_FIELD_TYPES.USER_ADD_ADDRESS}
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
