import { TextInput, TextInputProps } from "react-native";

interface FormStyledInputProps extends TextInputProps {
  className?: string;
  placeholderTextColor?: string;
}

const FormStyledInput = ({
  className = "border border-app-color-warmgreylight font-lexend rounded-md px-4 py-3 text-base", // remove bold here
  placeholderTextColor = "#6E6A7C", // softer gray
  ...rest
}: FormStyledInputProps) => {
  return (
    <TextInput
      className={className}
      placeholderTextColor={placeholderTextColor}
      {...rest}
    />
  );
};

export default FormStyledInput;
