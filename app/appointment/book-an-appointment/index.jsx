import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppLayout from "@/components/layouts/AppLayout";
import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import Checkbox from "expo-checkbox";
import FORM_VALIDATIONS from "@/libs/form-validations";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import { useAppToast } from "@/hooks/useAppToast";
import useAxios from "@/hooks/useAxios";

const BookAnAppointmentScreen = () => {
  const {
    request: submitDoctorAppointment,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.BOOK_APPOINTMENT_DOCTOR),
    defaultValues: {
      confirmation: false,
    },
  });

  const onSubmit = async (payload) => {
    console.log("Appointment Request:", payload);

    const { data, error } = await submitDoctorAppointment({
      url: "/user/create-doctoreLead",
      method: "POST",
      payload: payload,
    });

    if (!error) {
      if (data.status === 201) {
        showToast("success", data.message || "Enquiry submitted successfully.");
      }
    } else {
      showToast("error", error || "Something went wrong");
      console.log(error || "Something went wrong");
    }
  };

  return (
    <AppLayout>
      <View className="py-8">
        <Text className="text-2xl font-lexend-bold text-app-color-black mb-2">
          Book an Appointment
        </Text>
        <Text className="text-base font-lexend text-app-color-grey mb-6 leading-relaxed">
          Schedule a visit with a medical expert
        </Text>

        {/* Form fields */}
        <FormFieldRenderer
          control={control}
          errors={errors}
          fields={FORM_FIELD_TYPES.BOOK_APPOINTMENT_DOCTOR}
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
                color={value ? "#FF0000" : undefined} // red when checked
                className="mr-4"
              />
            )}
          />
          <Text className="font-lexend text-app-color-black flex-1">
            I confirm all information is correct
          </Text>
        </View>
        {errors.confirmation && (
          <Text className="text-xs text-red-500 mb-4">
            {errors.confirmation.message}
          </Text>
        )}
        {errors.confirmation && (
          <Text className="text-xs text-red-500 mb-4">
            {errors.confirmation.message}
          </Text>
        )}

        {/* Submit button */}
        <TouchableOpacity
          className="bg-app-color-red py-4 rounded-xl mt-2"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-lexend-bold text-center text-base">
            Submit Appointment Request
          </Text>
        </TouchableOpacity>
      </View>
    </AppLayout>
  );
};

export default BookAnAppointmentScreen;
