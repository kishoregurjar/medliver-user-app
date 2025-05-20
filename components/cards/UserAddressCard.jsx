import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const UserAddressCard = ({
  address = {},
  onEdit,
  onSetDefault,
  onDelete,
  settingDefault = false,
  activeSetId = null,
}) => {
  const {
    _id,
    address_type,
    house_number,
    street,
    landmark,
    city,
    state,
    pincode,
    country,
    is_default,
  } = address || {};

  if (!_id) return null; // Guard against rendering invalid data

  return (
    <View className="bg-white rounded-3xl p-5 border border-background-soft my-2">
      <View className="flex-row items-center space-x-2 mb-2">
        <MaterialIcons name="location-on" size={20} color="#5C59FF" />
        <Text className="text-base font-semibold text-gray-800 capitalize">
          {address_type || "Other"}
        </Text>
        {is_default && (
          <View className="ml-2 bg-indigo-100 px-2 py-0.5 rounded-full">
            <Text className="text-xs text-indigo-600 font-medium">Default</Text>
          </View>
        )}
      </View>

      <Text className="text-sm text-gray-700">
        {[house_number, street, landmark].filter(Boolean).join(", ")}
      </Text>
      <Text className="text-sm text-gray-700">
        {[city, state].filter(Boolean).join(", ")}
        {pincode ? ` - ${pincode}` : ""}
      </Text>
      <Text className="text-sm text-gray-700">{country || "India"}</Text>

      <View className="flex-row justify-end pt-2 gap-2">
        {typeof onEdit === "function" && (
          <TouchableOpacity
            className="px-4 py-1 rounded-xl bg-gray-100"
            onPress={() => onEdit(_id)}
          >
            <Text className="text-sm text-gray-600">Edit</Text>
          </TouchableOpacity>
        )}

        {!is_default && typeof onSetDefault === "function" && (
          <TouchableOpacity
            className="px-4 py-1 rounded-xl bg-indigo-100"
            onPress={() => onSetDefault(_id)}
            disabled={settingDefault}
          >
            <Text className="text-sm text-indigo-600">
              {settingDefault && activeSetId === _id
                ? "Setting..."
                : "Set Default"}
            </Text>
          </TouchableOpacity>
        )}

        {typeof onDelete === "function" && (
          <TouchableOpacity
            className="px-3 py-1 rounded-xl bg-red-100"
            onPress={() => onDelete(_id)}
          >
            <MaterialIcons name="delete" size={18} color="#dc2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UserAddressCard;
