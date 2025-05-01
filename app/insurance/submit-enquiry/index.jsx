import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FormFieldRenderer from "@/components/inputs/FormFieldRenderer";
import useAxios from "@/hooks/useAxios";
import { useAppToast } from "@/hooks/useAppToast";
import Checkbox from "expo-checkbox";
import FORM_FIELD_TYPES from "@/libs/form-field-types";
import FORM_VALIDATIONS from "@/libs/form-validations";

const InsuranceEnquiryScreen = () => {
  const {
    request: submitEnquiry,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const { showToast } = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
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
    console.log("Insurance Enquiry Submitted:", payload);

    const { data, error } = await submitEnquiry({
      url: "/user/apply-for-insurance",
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
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-y-2">
            <Text className="text-2xl font-lexend-bold text-app-color-black dark:text-white mb-1">
              Insurance Enquiry
            </Text>
            <Text className="text-base font-lexend text-app-color-grey dark:text-neutral-300 mb-5 leading-relaxed">
              Submit your insurance-related questions and we’ll get back to you.
            </Text>

            <FormFieldRenderer
              control={control}
              errors={errors}
              fields={fields.filter((f) => f.visible !== false)}
            />

            <View className="flex-row items-center mt-6">
              <Controller
                control={control}
                name="termsAccepted"
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
                        colorScheme="#ffffff"
                      />
                      <Text className="text-app-color-black font-lexend dark:text-white ml-2">
                        I agree to the{" "}
                        <Text className="text-app-color-red font-lexend">
                          Terms & Conditions
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    {error && (
                      <Text className="text-app-color-red mt-1 text-xs">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit, (formErrors) =>
                console.log("Form Validation Errors:", formErrors)
              )}
              className="mt-6 py-4 rounded-xl bg-app-color-red shadow-md active:opacity-80"
            >
              <Text className="text-white text-center text-base font-lexend-bold">
                Submit Enquiry
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InsuranceEnquiryScreen;
