import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useAppToast } from "@/hooks/useAppToast";
import Checkbox from "expo-checkbox";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import FORM_VALIDATIONS from "@/libs/form-validations";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import CTAButton from "@/components/common/CTAButton";

const InsuranceEnquiryScreen = () => {
  const { request: submitEnquiry, loading: isLoading } = useAxios();

  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(FORM_VALIDATIONS.INSURANCE_SUBMIT_ENQUIRY),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      lead_type: "",
      age: "",
      gender: "",
      coverage_for: "",
      family_member_count: "",
      income: "",
      nominee_name: "",
      nominee_relation: "",
      lead_source: "",
    },
  });

  const fields = FORM_FIELD_TYPES.INSURANCE_ENQUIRY.map((field) => ({
    ...field,
    visible:
      typeof field.visibleIf === "function"
        ? field.visibleIf((name) => useWatch({ control, name }))
        : field.visible !== false,
  }));

  const onSubmit = async (payload) => {
    const { data, error } = await submitEnquiry({
      url: "/user/apply-for-insurance",
      method: "POST",
      payload,
    });

    if (!error && data.status === 201) {
      showToast("success", data.message || "Enquiry submitted successfully.");
      reset();
    } else {
      showToast("error", error || "Something went wrong");
    }
  };

  return (
    <AppLayout scroll={false}>
      {/* Static Header */}
      <HeaderWithBack
        showBackButton
        title="Insurance Enquiry"
        clearStack
        backTo="/home"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-8">
          <Text className="text-2xl font-lexend-bold text-text-black dark:text-white mb-1">
            Insurance Enquiry
          </Text>
          <Text className="text-base font-lexend text-text-muted dark:text-neutral-300 mb-5 leading-relaxed">
            Submit your insurance-related questions and we’ll get back to you.
          </Text>

          <FormFieldRenderer
            control={control}
            errors={errors}
            fields={fields.filter((f) => f.visible !== false)}
          />

          <View className="flex-row items-center my-5">
            <Controller
              control={control}
              name="agree"
              defaultValue={false}
              rules={{ required: "You must accept the terms and conditions" }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <View className="flex-1">
                  <TouchableOpacity
                    onPress={() => onChange(!value)}
                    activeOpacity={0.8}
                    className="flex-row items-center"
                  >
                    <Checkbox
                      value={value}
                      onValueChange={onChange}
                      color="#B31F24"
                    />
                    <Text className="text-text-primary font-lexend dark:text-white ml-2">
                      I Confirm all the information is correct and agree to the{" "}
                      <Text className="text-brand-primary font-lexend">
                        Terms & Conditions
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  {error && (
                    <Text className="text-red-500 mt-1 text-xs font-lexend">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <CTAButton
            label="Submit Enquiry"
            onPress={handleSubmit(onSubmit)}
            loaderText="Submitting..."
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default InsuranceEnquiryScreen;
