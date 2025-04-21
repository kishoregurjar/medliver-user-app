import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FormLabel from "./FormLabel";
import FormError from "./FormError";
import { FormBaseProps, Option } from "@/types/formTypes";

const FormMultiSelectInput = ({
  label,
  value,
  onChange,
  options,
  error,
  className = "",
}: FormBaseProps & { value: string[]; options: Option[] }) => {
  const toggleOption = (val: string) => {
    const updated = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(updated);
  };

  return (
    <View className={className}>
      <FormLabel label={label} />
      <View className="flex-row flex-wrap">
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => toggleOption(opt.value)}
            className="flex-row items-center mr-4 mb-2"
          >
            <View
              className={`w-4 h-4 rounded-md border border-app-color-warmgreylight mr-2 ${
                value.includes(opt.value) ? "bg-app-color-red" : ""
              }`}
            />
            <Text>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FormError error={error} />
    </View>
  );
};

export default FormMultiSelectInput;
