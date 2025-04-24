import { Text } from "react-native";

const FormError = ({ error, className = "" }) =>
  error ? (
    <Text className={`text-red-500 text-xs mb-2 font-lexend-bold ${className}`}>
      {error}
    </Text>
  ) : null;

export default FormError;
