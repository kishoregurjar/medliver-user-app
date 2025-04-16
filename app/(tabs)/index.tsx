import { Text, View, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-blue-500 p-4">
      <View className="mt-10 space-y-4">
        <Text className="text-4xl font-bold text-white">Welcome 👋</Text>
        <Text className="text-lg text-white opacity-90">
          This is Text styled using{" "}
          <Text className="font-semibold">NativeWind</Text>.
        </Text>

        <View className="mt-6 bg-white/10 p-4 rounded-2xl">
          <Text className="text-white">
            🔥 Tailwind in React Native just hits different!
          </Text>
        </View>

        {/* Add more UI below as needed */}
      </View>
    </ScrollView>
  );
}
