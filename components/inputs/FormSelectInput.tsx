import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import FormLabel from "./FormLabel";
import FormError from "./FormError";
import { FormBaseProps, Option } from "@/types/formTypes";

const FormSelectInput = ({
  label,
  value,
  onChange,
  options,
  error,
  className = "",
}: FormBaseProps & { options: Option[] }) => (
  <View className={className}>
    <FormLabel label={label} />
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={{ height: 50 }}
    >
      {options.map((opt) => (
        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
      ))}
    </Picker>
    <FormError error={error} />
  </View>
);

export default FormSelectInput;
