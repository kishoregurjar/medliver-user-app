import { TextInput, View } from "react-native";
import React from "react";

const FormStyledInput = ({
  className = "border border-background-soft font-lexend rounded-md px-2 py-1 text-base",
  placeholderTextColor = "#6E6A7C",
  rightIcon,
  ...rest
}) => {
  return (
    <View className={`bg-white flex-row items-center ${className}`}>
      <TextInput
        className="flex-1 p-2 text-black"
        placeholderTextColor={placeholderTextColor}
        {...rest}
      />
      {rightIcon && <View className="ml-2">{rightIcon}</View>}
    </View>
  );
};

export default FormStyledInput;
