import { View, Text, ScrollView } from "react-native";
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
import HeaderWithBack from "@/components/common/HeaderWithBack";
import CTAButton from "@/components/common/CTAButton";

const BookAnAppointmentScreen = () => {
  const { request: submitDoctorAppointment, loading: isLoading } = useAxios();

  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(FORM_VALIDATIONS.BOOK_APPOINTMENT_DOCTOR),
    defaultValues: {
      agree: false,
    },
  });

  const onSubmit = async (payload) => {
    const { data, error } = await submitDoctorAppointment({
      url: "/user/create-doctoreLead",
      method: "POST",
      payload: payload,
    });

    if (!error && data?.status === 201) {
      showToast("success", data.message || "Enquiry submitted successfully.");
      reset();
    } else {
      showToast("error", error || "Something went wrong");
    }
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack
        showBackButton
        title="Book an Appointment"
        clearStack
        backTo={"/home"}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-8">
          <Text className="text-2xl font-lexend-bold text-text-primary mb-2">
            Book an Appointment with our Nursing Care Experts
          </Text>
          <Text className="text-base font-lexend text-text-muted mb-6 leading-relaxed">
            Schedule a visit with a medical expert
          </Text>

          {/* Form fields */}
          <FormFieldRenderer
            control={control}
            errors={errors}
            fields={FORM_FIELD_TYPES.BOOK_APPOINTMENT_DOCTOR}
          />

          {/* Agree Checkbox */}
          <View className="flex-row items-center space-x-2 mb-6 mt-2">
            <Controller
              control={control}
              name="agree"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  value={value}
                  onValueChange={onChange}
                  color={value ? "#B31F24" : undefined} // red when checked
                  className="mr-4"
                />
              )}
            />
            <Text className="font-lexend text-text-primary flex-1">
              I confirm all information is correct and agree to the{" "}
              <Text className="text-brand-primary">Terms & Conditions</Text>
            </Text>
          </View>
          {errors.agree && (
            <Text className="text-xs text-red-500 font-lexend mb-4">
              {errors.agree.message}
            </Text>
          )}

          <CTAButton
            label="Book an Appointment"
            onPress={handleSubmit(onSubmit)}
            loaderText="Booking..."
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default BookAnAppointmentScreen;
