import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";

const GetQuotesScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Top Red Section (40%) */}
      <View className="flex-[0.4] bg-brand-primary items-center justify-center px-6">
        <Text className="text-white text-3xl font-lexend-bold text-center mb-2">
          Compare & Buy Insurance Instantly
        </Text>
        <Text className="text-white font-lexend text-xl text-center opacity-90">
          Health & Life. Get the best quotes in minutes!
        </Text>
      </View>

      {/* Bottom White Section (60%) */}
      <View className="flex-[0.6] bg-white items-center justify-center px-6">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-brand-primary w-full py-4 rounded-lg items-center"
          style={{
            elevation: Platform.OS === "android" ? 4 : 0,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
          onPress={() => {
            router.push(ROUTE_PATH.INSURANCE.SUBMIT_ENQUIRY);
          }}
        >
          <Text className="text-white text-lg font-lexend">Get Quotes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetQuotesScreen;
