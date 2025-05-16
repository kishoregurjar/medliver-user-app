import Header from "@/components/common/Header";
import NavigationTiles from "@/components/common/NavigationTiles";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuthUser } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <AppLayout>
      {/* Header */}
      <Header />

      {/* Navigation Tiles */}
      <NavigationTiles />

      {/* Livvie ChatBot */}
      <View className="pb-36 px-4">
        {/* <Text className="text-2xl font-bold text-gray-800 mb-4">
          Livvie ChatBot
        </Text>

        <Text className="text-lg text-gray-600 mb-4">
          Livvie is a chatbot that can help you with your health and wellness
          needs.
        </Text> */}

        <Pressable
          onPress={() => router.push("/livvie-chat")}
          className="p-4 rounded-2xl bg-accent-softIndigo flex-row items-center justify-between shadow-lg"
        >
          <View className="flex-1">
            <Text className="text-lg font-lexend-bold text-white mb-1">
              Meet Livvie
            </Text>
            <Text className="text-base font-lexend-medium text-white">Hello, I'm Livvie! How can I assist you today?</Text>
          </View>
          <Ionicons name="chatbubbles" size={28} color="#fff" />
        </Pressable>
      </View>
    </AppLayout>
  );
}
