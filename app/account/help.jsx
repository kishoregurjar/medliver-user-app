import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

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
    answer: "Go to 'Settings' > 'Change Password' and follow the steps.",
  },
  {
    question: "How can I track my order?",
    answer: "Go to 'My Orders' to view real-time updates.",
  },
  {
    question: "How do I contact support?",
    answer: "Tap 'Contact Support' below to start a chat or email.",
  },
];

const otherTopics = [
  {
    title: "Payment & Transfers",
    icon: "credit-card",
    onPress: () => console.log("Payment help tapped"),
  },
  {
    title: "Cards & Account",
    icon: "account-balance",
    onPress: () => console.log("Cards help tapped"),
  },
  {
    title: "Call Support",
    icon: "phone-in-talk",
    onPress: () => Linking.openURL("tel:+1234567890"),
  },
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Help & Support" />

      <ScrollView className="flex-1 pt-4 pb-10 gap-4">
        {/* Greeting */}
        <View className="px-4 mb-4">
          <Text className="text-2xl font-lexend-bold text-gray-900">
            Hi there 👋
          </Text>
          <Text className="text-base font-lexend text-gray-600">
            How can we help you today?
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-white px-4 py-3 mb-4 rounded-2xl flex-row items-center">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search help articles..."
            placeholderTextColor="#6B7280"
            className="ml-2 flex-1 text-base text-gray-800"
          />
        </View>

        {/* Priority Support Banner */}
        <TouchableOpacity activeOpacity={0.7} className="mb-4">
          <LinearGradient
            colors={["#6B73FF", "#000DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-5"
          >
            <Text className="text-white text-lg font-semibold">
              🎯 Priority Support
            </Text>
            <Text className="text-white text-sm mt-1">
              Get instant help from our support experts.
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Popular Questions */}
        <View className="bg-white p-5 mb-4 rounded-3xl shadow-sm gap-4">
          <Text className="text-lg font-bold text-gray-900">
            Popular Questions
          </Text>
          {faqs.map((faq, index) => (
            <View key={index} className="border border-gray-200 rounded-2xl">
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                className="flex-row justify-between items-center px-4 py-4 bg-gray-50 rounded-2xl"
              >
                <Text className="text-base font-medium text-gray-800 flex-1 pr-3">
                  {faq.question}
                </Text>
                <MaterialIcons
                  name={expandedIndex === index ? "expand-less" : "expand-more"}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <View className="px-4 pb-4 pt-1 bg-white rounded-b-2xl">
                  <Text className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Other Topics */}
        <View className="bg-white p-5 mb-4 rounded-3xl shadow-sm">
          <Text className="text-lg font-bold text-gray-900">Other Topics</Text>
          <View className="flex-row flex-wrap justify-between">
            {otherTopics.map((topic, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={topic.onPress}
                className="w-[48%] bg-white p-4 mb-3 rounded-2xl shadow-sm items-start"
              >
                <MaterialIcons name={topic.icon} size={24} color="#5C59FF" />
                <Text className="mt-3 text-base font-medium text-gray-800">
                  {topic.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
}
