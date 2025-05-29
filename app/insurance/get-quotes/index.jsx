import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";
import CTAButton from "@/components/common/CTAButton";

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
        <CTAButton
          label="Get Quotes"
          onPress={() => {
            router.push(ROUTE_PATH.APP.INSURANCE.SUBMIT_ENQUIRY);
          }}
          size="lg"
          className="w-full mt-4"
        />
      </View>
    </View>
  );
};

export default GetQuotesScreen;
