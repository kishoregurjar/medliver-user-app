import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
];

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
    resolver: yupResolver(schema),
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
          {addressFields.map((_, index) => (
            <SkeletonFormField key={index} />
          ))}
        </>
      ) : (
        <ScrollView
          className="px-4 py-6"
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
            fields={addressFields}
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
