import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Switch } from "react-native";
import { useForm, Controller } from "react-hook-form";
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
    type: "select",
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

export default function AddAddressScreen() {
  const router = useRouter();
  const { showToast } = useAppToast();
  const { request: addAddress, loading } = useAxios();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      location: {
        lat: 22.69992214152458,
        lng: 75.83582576647855,
      },
    };

    const { data, error } = await addAddress({
      url: "/user/add-address",
      method: "POST",
      authRequired: true,
      data: payload,
    });

    if (error) {
      showToast("error", error || "Failed to add address");
    } else {
      showToast("success", "Address added successfully!");
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

        {/* Default Address Toggle */}
        <Controller
          control={control}
          name="is_default"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row items-center justify-between my-4">
              <Text className="text-sm font-medium text-gray-700">
                Set as Default Address
              </Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          className={`bg-brand-primary mt-4 py-3 rounded-xl ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Saving..." : "Save Address"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}
