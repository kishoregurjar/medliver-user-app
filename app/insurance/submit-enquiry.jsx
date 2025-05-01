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

const schema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  phone_number: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  lead_type: yup.string().required("Lead type is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be an integer"),
  gender: yup.string().required("Gender is required"),
  coverage_for: yup.string().required("Coverage selection is required"),
  family_member_count: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value
    )
    .nullable()
    .when("coverage_for", {
      is: "family",
      then: (schema) =>
        schema
          .typeError("Family member count must be a number")
          .required("Family member count is required")
          .min(1, "At least one family member required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  income: yup
    .number()
    .typeError("Income must be a number")
    .required("Income is required"),
  nominee_name: yup.string().required("Nominee name is required"),
  nominee_relation: yup.string().required("Nominee relation is required"),
  lead_source: yup.string().required("Lead source is required"),
});

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
    resolver: yupResolver(schema),
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

  const coverageFor = useWatch({ control, name: "coverage_for" });

  const fields = [
    {
      name: "full_name",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      name: "phone_number",
      label: "Phone Number",
      placeholder: "Enter 10-digit number",
      type: "number",
      keyboardType: "numeric",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
      keyboardType: "email-address",
    },
    {
      name: "lead_type",
      label: "Lead Type",
      type: "select",
      options: [
        { label: "Health", value: "health" },
        { label: "Life", value: "life" },
        { label: "Vehicle", value: "vehicle" },
        { label: "Property", value: "property" },
      ],
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      keyboardType: "numeric",
      placeholder: "Enter your age",
    },
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "coverage_for",
      label: "Coverage For",
      type: "radio",
      options: [
        { label: "Self", value: "self" },
        { label: "Family", value: "family" },
      ],
    },
    {
      name: "family_member_count",
      label: "Family Member Count",
      placeholder: "Enter number of family members",
      type: "number",
      keyboardType: "numeric",
      visible: coverageFor === "family",
    },
    {
      name: "income",
      label: "Monthly Income",
      placeholder: "Enter your income",
      type: "number",
      keyboardType: "numeric",
    },
    {
      name: "nominee_name",
      label: "Nominee Name",
      placeholder: "Enter nominee name",
    },
    {
      name: "nominee_relation",
      label: "Nominee Relation",
      placeholder: "Enter nominee relation",
    },
    {
      name: "lead_source",
      label: "Lead Source",
      type: "select",
      options: [
        { label: "Website", value: "website" },
        { label: "Referral", value: "referral" },
        { label: "Advertisement", value: "advertisement" },
        { label: "Other", value: "other" },
      ],
    },
  ];

  const onSubmit = async (payload) => {
    console.log("Insurance Enquiry Submitted:", payload);

    const { data, error } = await submitEnquiry({
      url: "/user/apply-for-insurance",
      method: "POST",
      payload: payload,
    });

    if (!error) {
      if (data.status === 200) {
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
            <Text className="text-base text-app-color-grey dark:text-neutral-300 mb-5 leading-relaxed">
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
                      <Text className="text-app-color-black dark:text-white ml-2">
                        I agree to the{" "}
                        <Text className="text-app-color-red">
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
              <Text className="text-white text-center text-base font-semibold">
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
