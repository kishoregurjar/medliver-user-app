import { Text } from "react-native";

const FormLabel = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <Text
    className={`text-xs text-app-color-grey mb-2 font-lexend-bold ${className}`}
  >
    {label}
  </Text>
);

export default FormLabel;
