import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import FormLabel from "./FormLabel";
import FormError from "./FormError";
import { FormBaseProps } from "@/types/formTypes";

const FormPasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  className = "",
}: FormBaseProps) => {
  const [isSecureEntry, setIsSecureEntry] = useState(true);

  return (
    <View className={className}>
      <FormLabel label={label} />
      <View className="relative">
        <TextInput
          className="border border-app-color-warmgreylight rounded-md px-4 py-3 mb-3 text-black"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={isSecureEntry}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setIsSecureEntry((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <Ionicons
            name={isSecureEntry ? "eye-off" : "eye"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <FormError error={error} />
    </View>
  );
};

export default FormPasswordInput;
