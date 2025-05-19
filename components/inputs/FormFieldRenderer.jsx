/**
 * FormFieldRenderer
 *
 * Renders form fields dynamically using react-hook-form's `Controller`.
 * Supports input types: text, password, select, multiselect, switch, checkbox, radio, textarea.
 *
 * Dependencies:
 * - react-hook-form
 * - expo-checkbox
 * - @react-native-picker/picker
 * - NativeWind (for styling with Tailwind-like classNames)
 *
 * @component
 *
 * @prop {Object} props
 * @prop {Control} props.control - react-hook-form control object
 * @prop {Object} props.errors - Errors object from react-hook-form
 * @prop {Array<Object>} props.fields - Array of field config objects
 *
 * @example
 * const fields = [
 *   { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
 *   { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
 *   { name: 'gender', label: 'Gender', type: 'radio', options: [
 *       { label: 'Male', value: 'male' },
 *       { label: 'Female', value: 'female' }
 *     ] },
 *   { name: 'acceptTerms', label: 'Accept Terms', type: 'checkbox' },
 *   { name: 'country', label: 'Country', type: 'select', options: [
 *       { label: 'USA', value: 'us' },
 *       { label: 'Canada', value: 'ca' }
 *     ] },
 *   { name: 'notifications', label: 'Enable Notifications', type: 'switch' },
 *   { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell us about yourself...' }
 * ]
 *
 * <FormFieldRenderer control={control} errors={errors} fields={fields} />
 */

import React, { useState } from "react";
import { View, TextInput, Switch, TouchableOpacity, Text } from "react-native";
import { Controller } from "react-hook-form";
import FormLabel from "@/components/inputs/FormLabel";
import FormStyledInput from "@/components/inputs/FormStyledInput";
import FormError from "@/components/inputs/FormError";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

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

                  {/* Password Input */}
                  {field.type === "password" ? (
                    <View>
                      <View className="bg-white flex-row items-center border border-background-soft font-lexend rounded-md px-2 py-1 text-base">
                        <TextInput
                          className="flex-1 p-2 text-black"
                          placeholder={field.placeholder}
                          placeholderTextColor="#6E6A7C"
                          onChangeText={(val) => {
                            onChange(val);
                            field.onChangeCustom?.(val);
                          }}
                          onBlur={onBlur}
                          value={value}
                          secureTextEntry={isSecure}
                          keyboardType={field.keyboardType || "default"}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                          className="ml-2"
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
                    <View className="bg-white border border-background-soft rounded-lg">
                      <Picker
                        selectedValue={value}
                        onValueChange={(val) => {
                          if (field.type === "multiselect") {
                            const arr = Array.isArray(value) ? [...value] : [];
                            const index = arr.indexOf(val);
                            if (index > -1) arr.splice(index, 1);
                            else arr.push(val);
                            onChange(arr);
                            field.onChangeCustom?.(arr);
                          } else {
                            onChange(val);
                            field.onChangeCustom?.(val);
                          }
                        }}
                        mode="dropdown"
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
                    <View className="flex-row items-center justify-between p-2 border rounded-lg border-background-soft">
                      <Text className="text-base">{field.label}</Text>
                      <Switch
                        value={value}
                        onValueChange={(val) => {
                          onChange(val);
                          field.onChangeCustom?.(val);
                        }}
                        color={value ? "#B31F24" : undefined}
                      />
                    </View>
                  ) : field.type === "checkbox" ? (
                    <View className="flex-row items-center gap-3">
                      <Checkbox
                        value={value}
                        onValueChange={(val) => {
                          onChange(val);
                          field.onChangeCustom?.(val);
                        }}
                        color={value ? "#B31F24" : undefined}
                      />
                      <Text className="text-base text-gray-800">
                        {field.label}
                      </Text>
                    </View>
                  ) : field.type === "radio" ? (
                    <View className="flex-row flex-wrap gap-x-6 gap-y-3">
                      {field.options?.map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          className="flex-row items-center"
                          onPress={() => {
                            onChange(opt.value);
                            field.onChangeCustom?.(opt.value);
                          }}
                        >
                          <View
                            className={`w-5 h-5 mr-2 rounded-full border-2 items-center justify-center ${
                              value === opt.value
                                ? "border-brand-primary"
                                : "border-text-muted"
                            }`}
                          >
                            {value === opt.value && (
                              <View className="w-2 h-2 rounded-full bg-brand-primary" />
                            )}
                          </View>
                          <Text>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <FormStyledInput
                      placeholder={field.placeholder}
                      onBlur={onBlur}
                      onChangeText={(val) => {
                        onChange(val);
                        field.onChangeCustom?.(val);
                      }}
                      value={value}
                      multiline={field.type === "textarea"}
                      keyboardType={field.keyboardType || "default"}
                      className="border border-background-soft font-lexend rounded-md px-2 py-1 text-base"
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
