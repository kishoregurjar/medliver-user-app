import { TextInput, View } from "react-native";
import React from "react";
import FormLabel from "./FormLabel";
import FormError from "./FormError";

const FormTextArea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  className = "",
}) => (
  <View className={className}>
    <FormLabel label={label} />
    <TextInput
      multiline
      numberOfLines={4}
      className="border border-app-color-warmgreylight rounded-md px-4 py-3 mb-3 text-black"
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      placeholderTextColor="#999"
    />
    <FormError error={error} />
  </View>
);

export default FormTextArea;
