import { Text } from "react-native";
import React from "react";

const FormLabel = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <Text className={`text-xs text-app-color-grey mb-2 font-bold ${className}`}>
    {label}
  </Text>
);

export default FormLabel;
