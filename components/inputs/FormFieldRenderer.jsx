import React, { useState } from "react";
import { View, TextInput, Switch, TouchableOpacity, Text } from "react-native";
import { Controller } from "react-hook-form";
import FormLabel from "@/components/inputs/FormLabel";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import FormError from "@/components/inputs/FormError";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const FormFieldRenderer = ({ control, errors, fields }) => {
  return (
    <>
      {fields
        .filter((field) => field.visible !== false)
        .map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: { onChange, onBlur, value } }) => {
              const [showPassword, setShowPassword] = useState(false);
              const isSecure = field.type === "password" && !showPassword;

              return (
                <View className="mb-5">
                  <FormLabel label={field.label} />

                  {/* Password */}
                  {field.type === "password" ? (
                    <View>
                      <View className="flex-row items-center border border-app-color-warmgreylight rounded-lg px-3">
                        <TextInput
                          className="flex-1 p-3 text-base"
                          placeholder={field.placeholder}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          secureTextEntry={isSecure}
                          keyboardType={field.keyboardType || "default"}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                        >
                          <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="gray"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : field.type === "select" ||
                    field.type === "multiselect" ? (
                    <View className="border border-app-color-warmgreylight rounded-lg">
                      <Picker
                        selectedValue={value}
                        onValueChange={(val) => {
                          if (field.type === "multiselect") {
                            const arr = Array.isArray(value) ? [...value] : [];
                            const index = arr.indexOf(val);
                            if (index > -1) arr.splice(index, 1);
                            else arr.push(val);
                            onChange(arr);
                          } else {
                            onChange(val);
                          }
                        }}
                        mode="dropdown"
                        multiple={field.type === "multiselect"}
                      >
                        <Picker.Item label={`Select ${field.label}`} value="" />
                        {field.options?.map((opt) => (
                          <Picker.Item
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                          />
                        ))}
                      </Picker>
                    </View>
                  ) : field.type === "switch" ? (
                    <View className="flex-row items-center justify-between p-2 border rounded-lg border-app-color-warmgreylight">
                      <Text className="text-base">{field.label}</Text>
                      <Switch value={value} onValueChange={onChange} />
                    </View>
                  ) : field.type === "checkbox" ? (
                    <TouchableOpacity
                      className="flex-row items-center gap-2"
                      onPress={() => onChange(!value)}
                    >
                      <View
                        className={`w-5 h-5 border rounded ${
                          value
                            ? "bg-app-color-red border-app-color-red"
                            : "border-app-color-warmgreylight"
                        }`}
                      />
                      <Text>{field.label}</Text>
                    </TouchableOpacity>
                  ) : field.type === "radio" ? (
                    <View className="flex-row flex-wrap gap-x-6 gap-y-3">
                      {field.options?.map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          className="flex-row items-center mr-4"
                          onPress={() => onChange(opt.value)}
                        >
                          <View
                            className={`w-4 h-4 rounded-full border mr-2 ${
                              value === opt.value
                                ? "bg-app-color-red border-app-color-red"
                                : "border-app-color-warmgreylight"
                            }`}
                          />
                          <Text>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    // Default: Text / Email / Number / Textarea
                    <FormStyledInput
                      placeholder={field.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline={field.type === "textarea"}
                      keyboardType={field.keyboardType || "default"}
                    />
                  )}

                  <FormError error={errors[field.name]?.message} />
                </View>
              );
            }}
          />
        ))}
    </>
  );
};

export default FormFieldRenderer;
