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

  if (!_id) return null;

  return (
    <View className="bg-white rounded-3xl p-5 border border-gray-200 my-3">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-2">
          <MaterialIcons name="location-on" size={20} color="#5C59FF" />
          <Text className="text-base font-semibold text-gray-900 capitalize">
            {address_type || "Other"}
          </Text>
          {is_default && (
            <View className="bg-indigo-100 px-2 py-0.5 rounded-full ml-1">
              <Text className="text-xs text-indigo-600 font-medium">
                Default
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Address Content */}
      <View className="mb-3">
        <Text className="text-sm text-gray-700 leading-5">
          {[house_number, street, landmark].filter(Boolean).join(", ")}
        </Text>
        <Text className="text-sm text-gray-700 leading-5">
          {[city, state].filter(Boolean).join(", ")}
          {pincode ? ` - ${pincode}` : ""}
        </Text>
        <Text className="text-sm text-gray-700 leading-5">
          {country || "India"}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between pt-1">
        {/* Left Side (Edit + Delete) */}
        <View className="flex-row gap-2">
          {typeof onEdit === "function" && (
            <TouchableOpacity
              className="flex-row items-center px-3 py-1 rounded-lg bg-gray-100"
              onPress={() => onEdit(_id)}
            >
              <MaterialIcons name="edit" size={16} color="#4B5563" />
              <Text className="ml-1 text-sm text-gray-700">Edit</Text>
            </TouchableOpacity>
          )}

          {typeof onDelete === "function" && (
            <TouchableOpacity
              className="flex-row items-center px-3 py-1 rounded-lg bg-red-100"
              onPress={() => onDelete(_id)}
            >
              <MaterialIcons name="delete" size={16} color="#dc2626" />
              <Text className="ml-1 text-sm text-red-600">Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Side (Set Default) */}
        {!is_default && typeof onSetDefault === "function" && (
          <TouchableOpacity
            className="flex-row items-center px-3 py-1 rounded-lg bg-indigo-100"
            onPress={() => onSetDefault(_id)}
            disabled={settingDefault}
          >
            <MaterialIcons name="check-circle" size={16} color="#5C59FF" />
            <Text className="ml-1 text-sm text-indigo-600">
              {settingDefault && activeSetId === _id
                ? "Setting..."
                : "Set Default"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UserAddressCard;
