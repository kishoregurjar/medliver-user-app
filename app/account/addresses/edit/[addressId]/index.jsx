import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Location from "expo-location";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppToast } from "@/hooks/useAppToast";
import SkeletonFormField from "@/components/skeletons/SkeletonFormField";
import CTAButton from "@/components/common/CTAButton";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingDots from "@/components/common/LoadingDots";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";

export default function EditAddressScreen() {
  const { addressId } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useAppToast();

  const { request: fetchAddress, loading: fetching } = useAxios();
  const { request: updateAddress, loading: updating } = useAxios();

  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      is_default: false,
    },
    resolver: yupResolver(FORM_VALIDATIONS.USER_EDIT_ADDRESS),
    mode: "onChange",
  });

  useEffect(() => {
    if (!addressId) return;

    const getAddressDetails = async () => {
      const { data, error } = await fetchAddress({
        url: `/user/get-address-by-id`,
        method: "GET",
        authRequired: true,
        params: { addressId },
      });

      if (error || !data?.data) {
        showToast("error", "Failed to fetch address details.");
        return;
      }

      const address = data.data;

      reset({
        address_type: address.address_type,
        house_number: address.house_number,
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        is_default: address?.is_default || false,
      });
    };

    getAddressDetails();
  }, [addressId]);

  const fetchCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("error", "Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverse = await Location.reverseGeocodeAsync(loc.coords);
      const address = reverse[0];

      setLocation(loc.coords);

      if (address) {
        setValue("street", address.street || "");
        setValue("city", address.city || "");
        setValue("state", address.region || "");
        setValue("pincode", address.postalCode || "");
        setValue("country", address.country || "");
      }
    } catch (err) {
      console.error("Location error:", err);
      showToast("error", "Failed to get current location");
    } finally {
      setLocationLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      addressId,
      location: {
        lat: location?.latitude || null,
        long: location?.longitude || null,
      },
    };

    const { data, error } = await updateAddress({
      url: "/user/edit-address",
      method: "PUT",
      authRequired: true,
      payload,
    });

    if (error) {
      showToast("error", error || "Failed to update address");
    } else {
      showToast("success", data.message || "Address updated successfully!");
      router.back();
    }
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Edit Address" />

      {fetching ? (
        <>
          <View className="flex-1 justify-center items-center mt-10">
            <LoadingDots
              title={"Loading Address... "}
              subtitle={"Please wait..."}
            />
          </View>
        </>
      ) : (
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
            loaderColor="#B31F24"
            variant="transparent"
            onPress={fetchCurrentLocation}
            loading={locationLoading}
            disabled={locationLoading}
            textClassName="text-brand-primary font-lexend-bold text-base"
            className="mb-4"
          />

          <FormFieldRenderer
            control={control}
            errors={errors}
            fields={FORM_FIELD_TYPES.USER_EDIT_ADDRESS}
          />

          <CTAButton
            label="Update Address"
            onPress={handleSubmit(onSubmit)}
            loaderText="Updating..."
            loading={updating}
            disabled={updating}
          />
        </ScrollView>
      )}
    </AppLayout>
  );
}
