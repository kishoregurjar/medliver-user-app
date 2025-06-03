import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Linking,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import STATIC from "@/utils/constants";

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
    subtitle:
      "Times frames and subscriptions control, transfer, and currency exchange",
    icon: "compare-arrows",
    onPress: () => console.log("Payment help tapped"),
  },
  {
    title: "Cards & Account",
    subtitle:
      "Information on cards details, PIN and limits, available cards, managing your account and top up",
    icon: "credit-card",
    onPress: () => console.log("Cards help tapped"),
  },
  {
    title: "Call Support",
    subtitle: "Monday to Friday 10:30 am to 1:30pm",
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
        <View className="mb-4">
          <Text className="text-2xl font-lexend-bold text-gray-900">
            Hi there 👋
          </Text>
          <Text className="text-base font-lexend text-gray-600">
            How can we help you today?
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-white px-4 py-1 mb-4 rounded-xl border border-background-soft flex-row items-center">
          <MaterialIcons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search help articles..."
            placeholderTextColor="#6B7280"
            className="ml-2 flex-1 text-base text-text-primary font-lexend"
          />
        </View>

        {/* Priority Support Banner */}
        <LinearGradient
          colors={["#E75A55", "#F0B646"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-8 mb-4"
          style={{
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Text Section (60%) */}
          <View style={{ flex: 0.6, paddingRight: 8 }}>
            <Text className="text-white text-xl font-lexend-bold">
              Priority Support
            </Text>
            <Text className="text-white text-sm font-lexend mt-2">
              Get your Questions answered faster in the Support Chat
            </Text>
          </View>
          {/* Image Section (40%) */}
          <View style={{ flex: 0.4 }}>
            <Image
              source={STATIC.IMAGES.PAGES.SUPPORT_HELP} // Replace with your image URL or local asset
              style={{ width: "100%", height: 80, resizeMode: "contain" }} // Adjust height as needed
            />
          </View>
        </LinearGradient>

        {/* Popular Questions */}
        <View className="gap-4 my-2">
          <Text className="text-lg font-lexend-bold text-text-primary">
            Popular Questions
          </Text>

          {faqs.map((faq, index) => (
            <View
              key={index}
              className="border border-background-soft rounded-2xl"
            >
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                activeOpacity={0.8}
                className={`flex-row justify-between items-center px-4 py-4 bg-gray-100 ${
                  expandedIndex === index ? "rounded-t-2xl" : "rounded-2xl"
                }`}
              >
                <Text className="text-base font-lexend-medium text-text-primary flex-1 pr-3">
                  {faq.question}
                </Text>
                <MaterialIcons
                  name={expandedIndex === index ? "expand-less" : "expand-more"}
                  size={24}
                  color="#212121"
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <View className="px-4 py-4 bg-white rounded-b-2xl">
                  <Text className="text-sm font-lexend text-text-muted leading-relaxed">
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Other Topics */}
        <View className="my-2">
          <Text className="text-lg font-lexend-bold text-text-primary">
            Other Topics
          </Text>
          <View>
            {otherTopics.map((topic, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={topic.onPress}
                className="p-4 mb-3 rounded-2xl flex flex-row justify-center items-center"
              >
                <View className="bg-white p-2 rounded-lg">
                  <MaterialIcons name={topic.icon} size={36} color="#212121" />
                </View>

                <View className="flex-1 ml-4">
                  <Text className="text-base font-lexend-medium text-text-primary">
                    {topic.title}
                  </Text>
                  <Text className="ml-auto text-sm font-lexend text-text-muted">
                    {topic.subtitle}
                  </Text>
                </View>

                <View className="ml-4">
                  <MaterialIcons
                    name={"arrow-forward-ios"}
                    size={14}
                    color="#212121"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
}
