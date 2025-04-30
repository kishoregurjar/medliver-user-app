import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";

import FormLabel from "@/components/inputs/FormLabel";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import FormError from "@/components/inputs/FormError";

// Validation Schema
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
  family_member_count: yup.number().when("coverage_for", {
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
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

  const onSubmit = (data) => {
    console.log("Insurance Enquiry Submitted:", data);
  };

  const renderInput = ({
    name,
    label,
    placeholder,
    multiline = false,
    keyboardType = "default",
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="mb-5">
          <FormLabel label={label} />
          <FormStyledInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            keyboardType={keyboardType}
          />
          <FormError error={errors[name]?.message} />
        </View>
      )}
    />
  );

  const renderPicker = ({ name, label, options }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="mb-5">
          <FormLabel label={label} />
          <View className="border border-gray-300 rounded-lg">
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label={`Select ${label}`} value="" />
              {options.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
          <FormError error={errors[name]?.message} />
        </View>
      )}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-8">
            <Text className="text-2xl font-lexend-bold text-app-color-black mb-2">
              Insurance Enquiry
            </Text>
            <Text className="text-base text-app-color-grey mb-6 leading-relaxed">
              Submit your insurance-related questions and we’ll get back to you.
            </Text>

            {renderInput({
              name: "full_name",
              label: "Full Name",
              placeholder: "Enter your full name",
            })}
            {renderInput({
              name: "phone_number",
              label: "Phone Number",
              placeholder: "Enter 10-digit number",
              keyboardType: "numeric",
            })}
            {renderInput({
              name: "email",
              label: "Email",
              placeholder: "Enter your email",
              keyboardType: "email-address",
            })}
            {renderPicker({
              name: "lead_type",
              label: "Lead Type",
              options: [
                { label: "Health", value: "health" },
                { label: "Life", value: "life" },
                { label: "Vehicle", value: "vehicle" },
                { label: "Property", value: "property" },
              ],
            })}
            {renderInput({
              name: "age",
              label: "Age",
              placeholder: "Enter your age",
              keyboardType: "numeric",
            })}
            {renderPicker({
              name: "gender",
              label: "Gender",
              options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ],
            })}
            {renderPicker({
              name: "coverage_for",
              label: "Coverage For",
              options: [
                { label: "Self", value: "self" },
                { label: "Family", value: "family" },
              ],
            })}

            {coverageFor === "family" &&
              renderInput({
                name: "family_member_count",
                label: "Family Member Count",
                placeholder: "Enter number of family members",
                keyboardType: "numeric",
              })}

            {renderInput({
              name: "income",
              label: "Monthly Income",
              placeholder: "Enter your income",
              keyboardType: "numeric",
            })}

            {renderInput({
              name: "nominee_name",
              label: "Nominee Name",
              placeholder: "Enter nominee name",
            })}
            {renderInput({
              name: "nominee_relation",
              label: "Nominee Relation",
              placeholder: "Enter nominee relation",
            })}
            {renderPicker({
              name: "lead_source",
              label: "Lead Source",
              options: [
                { label: "Website", value: "website" },
                { label: "Referral", value: "referral" },
                { label: "Advertisement", value: "advertisement" },
                { label: "Other", value: "other" },
              ],
            })}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="py-4 rounded-xl bg-app-color-blue"
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
