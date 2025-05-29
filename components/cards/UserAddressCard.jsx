import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CTAButton from "../common/CTAButton";

const UserAddressCard = ({
  address = {},
  onEdit,
  onSetDefault,
  onDelete,
  settingDefault = false,
  activeSetId = null,
  isDeleting = false,
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
          <Text className="text-base font-lexend-semibold text-gray-900 capitalize">
            {address_type || "Other"}
          </Text>
          {is_default && (
            <View className="bg-green-100 px-2 py-0.5 rounded-full ml-1">
              <Text className="text-xs text-green-600 font-lexend-semibold">
                Default
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Address Content */}
      <View className="mb-3">
        <Text className="text-sm font-lexend text-gray-700 leading-5">
          {[house_number, street, landmark].filter(Boolean).join(", ")}
        </Text>
        <Text className="text-sm font-lexend text-gray-700 leading-5">
          {[city, state].filter(Boolean).join(", ")}
          {pincode ? ` - ${pincode}` : ""}
        </Text>
        <Text className="text-sm font-lexend text-gray-700 leading-5">
          {country || "India"}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end pt-1">
        {/* Left Side (Edit + Delete) */}
        <View className="flex-row gap-2">
          {typeof onEdit === "function" && (
            <CTAButton
              label="Edit"
              icon={
                <MaterialIcons
                  name="edit"
                  size={14}
                  color="#5C59FF"
                  className="mr-1"
                />
              }
              onPress={() => onEdit(_id)}
              variant="custom"
              size="sm"
              className="flex-row items-center px-3 py-1 rounded-lg bg-indigo-100"
              textClassName="text-sm font-lexend text-indigo-600"
            />
          )}

          {!is_default && typeof onDelete === "function" && (
            <CTAButton
              label="Delete"
              icon={
                <MaterialIcons
                  name="delete"
                  size={14}
                  color="#dc2626"
                  className="mr-1"
                />
              }
              loaderText="Deleting..."
              loaderColor={"#dc2626"}
              loading={isDeleting}
              disabled={isDeleting}
              onPress={() => onDelete(_id)}
              variant="custom"
              size="sm"
              className="flex-row items-center px-3 py-1 rounded-lg bg-red-100"
              textClassName="text-sm font-lexend text-red-600"
            />
          )}
          {!is_default && typeof onSetDefault === "function" && (
            <CTAButton
              label="Set Default"
              icon={
                <MaterialIcons
                  name="check-circle"
                  size={14}
                  color="#16a34a"
                  className="mr-1"
                />
              }
              onPress={() => onSetDefault(_id)}
              loaderText="Setting..."
              loaderColor={"#16a34a"}
              variant="custom"
              size="sm"
              className="flex-row items-center px-3 py-1 rounded-lg bg-green-100"
              textClassName="text-sm font-lexend text-green-600"
              loading={settingDefault}
              disabled={settingDefault}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default UserAddressCard;
