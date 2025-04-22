import { TextInput } from "react-native";

const FormStyledInput = (props: any) => {
  return (
    <TextInput
      className="border border-app-color-warmgreylight rounded-md px-4 py-3 font-lexend-black"
      placeholderTextColor="#999"
      {...props}
    />
  );
};

export default FormStyledInput;
