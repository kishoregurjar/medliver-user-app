import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";
import { useAppToast } from "@/hooks/useAppToast";

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
    console.log("Payload:", formData);
    const payload = {
      ...formData,
      location: {
        lat: 22.69992214152458,
        long: 75.83582576647855,
      },
    };

    const { data, error } = await addAddress({
      url: "/user/add-address",
      method: "POST",
      authRequired: true,
      payload: payload,
    });

    if (error) {
      showToast("error", error || "Failed to add address");
    } else {
      showToast("success", data.message || "Address added successfully!");
      router.back();
    }
  };

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Add Address" />
      <ScrollView className="px-4 py-6" keyboardShouldPersistTaps="handled">
        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={addressFields}
        />

        <TouchableOpacity
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          className={`bg-brand-primary mt-4 py-3 rounded-xl ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold">
            {isLoading ? "Saving..." : "Save Address"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}
