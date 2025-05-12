import { Link, Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      {/* Set the screen header title */}
      <Stack.Screen options={{ title: "Page Not Found" }} />

      {/* Main Container */}
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-black">
        {/* Error Message */}
        <Text className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          🔍 Oops! The page you’re looking for doesn’t exist.
        </Text>

        {/* Developer Suggestion or Recovery Action */}
        <Text className="mt-3 text-center text-gray-600 dark:text-gray-400 text-base max-w-md">
          It might be a broken link, mistyped route, or the screen hasn’t been
          added yet.
        </Text>

        {/* Call to Action - Navigate back to Home */}
        <Link href="/home" asChild replace>
          <Pressable className="mt-6 bg-blue-600 px-6 py-3 rounded-xl shadow-md active:opacity-80">
            <Text className="text-white text-base font-medium">
              Go to Home Screen
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
