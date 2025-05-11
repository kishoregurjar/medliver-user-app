import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to 'Settings' > 'Change Password' and follow the steps to reset your password.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Go to 'My Orders' from the main menu to view real-time updates on your orders.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Visit the Help section and click 'Contact Support' to start a chat or send an email.",
  },
  {
    question: "Where can I view my prescriptions?",
    answer:
      "Navigate to 'My Prescriptions' from your dashboard to access all prescriptions.",
  },
];

const HelpScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Help & Support" />

      <ScrollView className="flex-1 pt-6 pb-10 space-y-2">
        {/* Help Center (FAQ) */}
        <View className="bg-white p-5 rounded-2xl space-y-4">
          <Text className="text-xl font-semibold text-gray-900">
            Help Center
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            Frequently asked questions to get you started.
          </Text>

          {faqs.map((faq, index) => (
            <View
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                className="flex-row justify-between items-center px-4 py-3 bg-gray-50"
                accessibilityRole="button"
                accessibilityLabel={faq.question}
              >
                <Text className="text-base font-medium text-gray-800 flex-1 pr-3">
                  {faq.question}
                </Text>
                <MaterialIcons
                  name={expandedIndex === index ? "expand-less" : "expand-more"}
                  size={24}
                  color="#6E6A7C"
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <View className="px-4 pb-4 pt-1 bg-white">
                  <Text className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Us */}
        <View className="bg-white p-5 rounded-2xl space-y-5">
          <Text className="text-xl font-semibold text-gray-900">
            Contact Us
          </Text>
          <Text className="text-sm text-gray-600">
            Need more help? Reach out via the options below:
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("tel:+1234567890")}
            className="flex-row items-center space-x-3 bg-indigo-50 p-3 rounded-xl"
          >
            <MaterialIcons name="phone" size={20} color="#5C59FF" />
            <Text className="text-base text-gray-800">+1 234 567 890</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:support@healthapp.com")}
            className="flex-row items-center space-x-3 bg-indigo-50 p-3 rounded-xl"
          >
            <MaterialIcons name="email" size={20} color="#5C59FF" />
            <Text className="text-base text-gray-800">
              support@healthapp.com
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={() => Linking.openURL("https://facebook.com")}
            >
              <FontAwesome name="facebook-square" size={28} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://twitter.com")}
            >
              <FontAwesome name="twitter-square" size={28} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://instagram.com")}
            >
              <FontAwesome name="instagram" size={28} color="#E1306C" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://linkedin.com")}
            >
              <FontAwesome name="linkedin-square" size={28} color="#0A66C2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default HelpScreen;
