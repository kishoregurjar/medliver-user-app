import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 1. Define Yup schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  message: yup.string().required("Message is required"),
});

const SubmitEnquiry = () => {
  // 2. Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // You can perform API submission here
    reset();
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-center mb-6 text-app-color-red">
        Submit Enquiry
      </Text>

      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              placeholder="Name"
              className="border border-gray-300 rounded-lg p-4 text-base"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Phone Field */}
      <Controller
        control={control}
        name="phone"
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
            {errors.phone && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Message Field */}
      <Controller
        control={control}
        name="message"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <TextInput
              placeholder="Message"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg p-4 text-base h-32"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.message && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.message.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-app-color-red py-4 rounded-lg items-center"
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
    </View>
  );
};

export default SubmitEnquiry;
