import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import axios from "axios";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

const BASE_URL = "https://zonal-presence-production.up.railway.app/api/v1/user";

export default function LivvieChatScreen() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    const existingId = await AsyncStorage.getItem("chatSessionId");
    if (existingId) {
      setSessionId(existingId);
      fetchChat(existingId);
    } else {
      const newId = uuid.v4();
      await AsyncStorage.setItem("chatSessionId", newId);
      setSessionId(newId);
      sendInitialGreeting(newId);
    }
  };

  const fetchChat = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/chat-history`, {
        params: { sessionId: id },
      });
      const history = res.data?.data || [];
      setMessages(history);
    } catch (err) {
      if (__DEV__) console.log("Fetch chat error:", err);
    }
  };

  const sendInitialGreeting = async (newId) => {
    try {
      const res = await axios.post(`${BASE_URL}/get-automated-answer`, {
        question: "hi",
        sessionId: newId,
      });
      const history = res.data?.history || [];
      const filtered = history.filter(
        (msg) => msg.content.toLowerCase() !== "hi"
      );
      setMessages(filtered);
    } catch (err) {
      if (__DEV__) console.log("Initial greeting error:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      content: input,
      _id: Date.now().toString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await axios.post(`${BASE_URL}/get-automated-answer`, {
        question: input,
        sessionId,
      });

      const fullHistory = res.data?.history || [];
      const newMessages = fullHistory.slice(updatedMessages.length); // Only new bot responses
      setMessages([...updatedMessages, ...newMessages]);
    } catch (err) {
      if (__DEV__) console.log("Send message error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View
      className={`mb-2 px-3 py-2 rounded-2xl max-w-[80%] ${
        item.role === "user"
          ? "bg-brand-primary self-end"
          : "bg-background-soft self-start"
      }`}
    >
      <Text
        className={`text-base ${
          item.role === "user" ? "text-white" : "text-black"
        }`}
      >
        {item.content}
      </Text>
    </View>
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Livvie Chat" />
      <View className="flex-1 p-4">
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />

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
