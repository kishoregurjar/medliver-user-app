// app/livvie-chat.tsx

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

export default function LivvieChatScreen() {
  const [messages, setMessages] = useState([
    {
      _id: "1",
      sender: "bot",
      text: "Hi, I'm Livvie! How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: "user", text: input };
    const botReply = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: "Thanks! I’ll get back to you shortly 🧠",
    };

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Livvie Chat" />
      <View className="flex-1 p-4">
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              className={`mb-2 px-3 py-2 rounded-2xl max-w-[80%] ${
                item.sender === "user"
                  ? "bg-brand-primary self-end"
                  : "bg-background-soft self-start"
              }`}
            >
              <Text
                className={`text-base ${
                  item.sender === "user" ? "text-white" : "text-black"
                }`}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
          className="flex-row items-center mt-2"
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            className="flex-1 border border-background-soft rounded-xl py-4 px-4 mr-2 bg-white"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="bg-brand-primary p-2 rounded-full"
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </AppLayout>
  );
}
