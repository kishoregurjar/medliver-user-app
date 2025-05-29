import Header from "@/components/common/Header";
import NavigationTiles from "@/components/common/NavigationTiles";
import AppLayout from "@/components/layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View, ScrollView } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <AppLayout scroll={false}>
      {/* Header stays fixed */}
      <Header />

      {/* Scrollable content */}
      <ScrollView
        // contentContainerStyle={{ paddingBottom: 144 }}
        showsVerticalScrollIndicator={false}
        className="px-4 mb-32"
      >
        <NavigationTiles />

        {/* Livvie ChatBot */}
        <View className="mt-4">
          <Pressable
            onPress={() => router.push("/livvie-chat")}
            className="p-4 rounded-2xl bg-accent-softIndigo flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-lg font-lexend-bold text-white mb-1">
                Meet Livvie
              </Text>
              <Text className="text-base font-lexend-medium text-white">
                Hello, I'm Livvie! How can I assist you today?
              </Text>
            </View>
            <Ionicons name="chatbubbles" size={28} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </AppLayout>
  );
}
