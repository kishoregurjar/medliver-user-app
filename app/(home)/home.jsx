import Header from "@/components/common/Header";
import NavigationTiles from "@/components/common/NavigationTiles";
import AppLayout from "@/components/layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <AppLayout scroll={false}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100, // ensures tile is above tab bar on all devices
        }}
      >
        <NavigationTiles />

        {/* Livvie ChatBot */}
        <View className="mt-4">
          <Pressable
            onPress={() => router.push("/livvie-chat")}
            className="p-4 rounded-2xl bg-accent-softIndigo flex-row items-center justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-1 pr-3">
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
