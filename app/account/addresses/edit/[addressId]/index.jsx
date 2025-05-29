import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppToast } from "@/hooks/useAppToast";
import SkeletonFormField from "@/components/skeletons/SkeletonFormField";
import CTAButton from "@/components/common/CTAButton";

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
  country: yup.string().required(),
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      is_default: false,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Fetch address data on mount
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
      });
    };

    getAddressDetails();
  }, [addressId]);

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      addressId,
      location: {
        lat: 22.69992214152458,
        long: 75.83582576647855,
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
    <AppLayout>
      <HeaderWithBack showBackButton title="Edit Address" />

      {fetching ? (
        <>
          {addressFields.map((_, index) => (
            <SkeletonFormField key={index} />
          ))}
        </>
      ) : (
        <ScrollView className="px-4 py-6" keyboardShouldPersistTaps="handled">
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
