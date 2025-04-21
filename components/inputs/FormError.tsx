import { Text } from "react-native";
import React from "react";

const FormError = ({
  error,
  className = "",
}: {
  error?: string;
  className?: string;
}) =>
  error ? (
    <Text className={`text-red-500 text-xs mb-2 ${className}`}>{error}</Text>
  ) : null;

export default FormError;
