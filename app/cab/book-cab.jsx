import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker"; // for dropdown

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
    .positive("Age must be positive")
    .required("Age is required"),
  gender: yup.string().required("Gender is required"),
  coverage_for: yup.string().required("Coverage for is required"),
  family_member_count: yup.number().when("coverage_for", {
    is: "family",
    then: (schema) => schema.required("Family member count is required"),
    otherwise: (schema) => schema.optional(),
  }),
  income: yup.number().required("Income is required"),
  nominee_name: yup.string().required("Nominee name is required"),
  nominee_relation: yup.string().required("Nominee relation is required"),
  lead_source: yup.string().required("Lead source is required"),
});

const BookCabScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const coverageFor = watch("coverage_for"); // Watch coverage for conditional field

  const onSubmit = (payload) => {
    console.log("Form Submitted:", payload);
    // API call can go here
    reset();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white p-6"
    >
      <Text className="text-2xl font-bold text-center mb-6 text-app-color-red">
        Apply for Insurance
      </Text>

      {/* Full Name */}
      <Controller
        control={control}
        name="full_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.full_name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.full_name.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Phone Number */}
      <Controller
        control={control}
        name="phone_number"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Phone Number"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.phone_number && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.phone_number.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Lead Type Dropdown */}
      <Controller
        control={control}
        name="lead_type"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4 border border-gray-300 rounded-lg">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
            >
              <Picker.Item label="Select Lead Type" value="" />
              <Picker.Item label="Life" value="life" />
              <Picker.Item label="Health" value="health" />
              <Picker.Item label="Car" value="car" />
            </Picker>
            {errors.lead_type && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.lead_type.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Age */}
      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Age"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? value.toString() : ""}
            />
            {errors.age && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.age.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Gender Dropdown */}
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4 border border-gray-300 rounded-lg">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
            {errors.gender && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Coverage For Dropdown */}
      <Controller
        control={control}
        name="coverage_for"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4 border border-gray-300 rounded-lg">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
            >
              <Picker.Item label="Coverage For" value="" />
              <Picker.Item label="Self" value="self" />
              <Picker.Item label="Family" value="family" />
            </Picker>
            {errors.coverage_for && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.coverage_for.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Family Member Count (only when coverage_for === 'family') */}
      {coverageFor === "family" && (
        <Controller
          control={control}
          name="family_member_count"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <TextInput
                placeholder="Family Member Count"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg p-4 text-base"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? value.toString() : ""}
              />
              {errors.family_member_count && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.family_member_count.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

      {/* Income */}
      <Controller
        control={control}
        name="income"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Income"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? value.toString() : ""}
            />
            {errors.income && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.income.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Nominee Name */}
      <Controller
        control={control}
        name="nominee_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Nominee Name"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.nominee_name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.nominee_name.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Nominee Relation */}
      <Controller
        control={control}
        name="nominee_relation"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <TextInput
              placeholder="Nominee Relation"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.nominee_relation && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.nominee_relation.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Lead Source */}
      <Controller
        control={control}
        name="lead_source"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <TextInput
              placeholder="Lead Source"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.lead_source && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.lead_source.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-app-color-red py-4 rounded-lg items-center mb-8"
        style={{
          elevation: Platform.OS === "android" ? 4 : 0,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-lg font-semibold">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookCabScreen;
