import React, { useState } from "react";
import { View, TextInput, Text, Switch, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";

interface Option {
  label: string;
  value: string;
}

interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "multiselect"
    | "radio"
    | "checkbox"
    | "switch";
  options?: Option[];
  placeholder?: string;
  rules?: object;
  defaultValue?: any;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  [key: string]: any; // rest props
}

const FormField: React.FC<FormFieldProps> = ({
  control,
  name,
  label,
  type,
  options = [],
  placeholder = "",
  rules = {},
  defaultValue = "",
  className = "",
  labelClassName = "text-sm text-[#6E6A7C] mb-1",
  inputClassName = "border border-gray-300 p-3 rounded-lg",
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const renderInput = (field: any) => {
    switch (type) {
      case "text":
      case "email":
        return (
          <TextInput
            className={inputClassName}
            placeholder={placeholder}
            onChangeText={field.onChange}
            value={field.value}
            {...rest}
          />
        );

      case "password":
        return (
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
            <TextInput
              className="flex-1 py-3"
              placeholder={placeholder}
              onChangeText={field.onChange}
              value={field.value}
              secureTextEntry={!isPasswordVisible}
              {...rest}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <AntDesign
                name={isPasswordVisible ? "eyeo" : "eye"}
                size={20}
                color="#6E6A7C"
              />
            </TouchableOpacity>
          </View>
        );

      case "textarea":
        return (
          <TextInput
            className={`${inputClassName} text-start`}
            placeholder={placeholder}
            onChangeText={field.onChange}
            value={field.value}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            {...rest}
          />
        );

      case "switch":
        return (
          <Switch
            value={field.value}
            onValueChange={field.onChange}
            {...rest}
          />
        );

      case "checkbox":
        return (
          <TouchableOpacity
            onPress={() => field.onChange(!field.value)}
            className="flex-row items-center space-x-2"
          >
            <View
              className={`w-5 h-5 border rounded-sm items-center justify-center ${
                field.value
                  ? "bg-[#5C59FF] border-[#5C59FF]"
                  : "bg-white border-gray-300"
              }`}
            >
              {field.value && (
                <AntDesign name="check" size={14} color="white" />
              )}
            </View>
            <Text className="text-sm text-[#6E6A7C]">{label}</Text>
          </TouchableOpacity>
        );

      case "select":
        return (
          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={field.value}
              onValueChange={field.onChange}
              {...rest}
            >
              <Picker.Item label={placeholder || "Select an option"} value="" />
              {options.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
        );

      case "radio":
        return (
          <View className="flex-row flex-wrap gap-3">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                className={`flex-row items-center space-x-2 ${
                  field.value === opt.value ? "opacity-100" : "opacity-60"
                }`}
                onPress={() => field.onChange(opt.value)}
              >
                <View
                  className={`w-4 h-4 rounded-full border ${
                    field.value === opt.value ? "bg-[#5C59FF]" : "bg-white"
                  }`}
                />
                <Text>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "multiselect":
        return (
          <View className="flex-row flex-wrap gap-2">
            {options.map((opt) => {
              const isSelected = field.value?.includes(opt.value);
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    const updated = isSelected
                      ? field.value.filter((val: string) => val !== opt.value)
                      : [...(field.value || []), opt.value];
                    field.onChange(updated);
                  }}
                  className={`px-3 py-1 rounded-full border ${
                    isSelected ? "bg-[#5C59FF] text-white" : "bg-white"
                  }`}
                >
                  <Text className="text-sm">{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className={`mb-5 ${className}`}>
      {label ? <Text className={labelClassName}>{label}</Text> : null}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => renderInput(field)}
      />
    </View>
  );
};

export default FormField;
