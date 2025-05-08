import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactOurExpert = () => {
  return (
    <View className="rounded-2xl flex-row items-center justify-between mb-6 py-4">
      {/* Text Block on Right */}
      <View className="flex-1 items-start">
        <Text className="text-lg font-lexend-bold text-text-primary mb-1 text-right">
          Call Our Experts
        </Text>
        <Text className="text-base text-text-muted font-lexend text-right">
          For home sample collection
        </Text>
      </View>

      {/* Call Button on Left */}
      <TouchableOpacity className="bg-brand-primary px-4 py-2 rounded-full flex-row items-center">
        <Ionicons name="call" size={20} color="#fff" />
        <Text className="text-white text-base font-lexend-semibold ml-2">
          Call Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactOurExpert;
