import { Text } from "react-native";

const FormLabel = ({ label, className = "" }) => (
  <Text
    className={`text-xs text-text-muted mb-2 font-lexend-bold ${className}`}
  >
    {label}
  </Text>
);

export default FormLabel;
