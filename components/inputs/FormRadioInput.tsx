import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FormLabel from "./FormLabel";
import FormError from "./FormError";
import { FormBaseProps, Option } from "@/types/formTypes";

const FormRadioInput = ({
  label,
  value,
  onChange,
  options,
  error,
  className = "",
}: FormBaseProps & { options: Option[] }) => (
  <View className={className}>
    <FormLabel label={label} />
    <View className="flex-row flex-wrap">
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onChange(option.value)}
          className="flex-row items-center mr-4 mb-2"
        >
          <View
            className={`w-4 h-4 rounded-full border border-app-color-warmgreylight mr-2 ${
              value === option.value ? "bg-app-color-red" : ""
            }`}
          />
          <Text>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <FormError error={error} />
  </View>
);

export default FormRadioInput;
