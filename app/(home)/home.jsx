import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import STATIC from "@/utils/constants";
import GradientBackground from "@/components/common/GradientEllipse";
import Header from "@/components/common/Header";
import NavigationTiles from "@/components/common/NavigationTiles";

export default function HomeScreen() {
  return (
    <GradientBackground
      animateBlobs
      darkMode={false}
      animationType="pulse"
      animationSpeed={1000}
    >
      <SafeAreaView className="flex-1">
        <StatusBar style="dark" />
        <ScrollView showsVerticalScrollIndicator={false} className="px-4 pt-2">
          {/* Header */}
          <Header />

          {/* Navigation Tiles */}
          <NavigationTiles />

          {/* Promo Banner */}
          {/* <View className="bg-[#EF4C47] p-4 rounded-2xl mb-6">
            <Text className="text-white font-bold text-xl mb-1">15% Off</Text>
            <Text className="text-white mb-3">Medicine at your doorstep</Text>
            <TouchableOpacity className="bg-[#FFE5D0] rounded-full px-4 py-2 self-start">
              <Text className="text-[#EF4C47] font-semibold">Shop Now</Text>
            </TouchableOpacity>
          </View> */}

          {/* Categories */}
          {/* <View className="mb-6">
            <Text className="text-lg font-bold mb-3">Categories</Text>
            <View className="flex-row gap-3">
              {["Medicine", "Pathology", "Diagnostics"].map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2"
                >
                  <Text className="text-[#6E6A7C]">{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View> */}

          {/* Best Seller */}
          {/* <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold">Best Seller Products</Text>
              <TouchableOpacity>
                <Text className="text-blue-600">See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-4"
            >
              {[1, 2, 3].map((item) => (
                <View
                  key={item}
                  className="w-40 bg-white rounded-xl shadow-sm p-3 mr-3"
                >
                  <Image
                    source={STATIC.IMAGES.COMPONENTS.MEDICINE_2}
                    className="w-full h-24 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="font-medium text-sm mb-1">
                    Vitamin D -3 250gm
                  </Text>
                  <Text className="text-xs text-gray-500">$212.00</Text>
                  <TouchableOpacity className="mt-2 bg-[#EF4C47] rounded-md py-1">
                    <Text className="text-white text-center text-sm">
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View> */}

          {/* Special Offer */}
          {/* <View className="bg-[#EF4C47] p-4 rounded-2xl mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-lg">Baby Organix</Text>
              <Text className="line-through text-white/60">$20</Text>
              <Text className="text-white text-xl font-bold">10$</Text>
              <Text className="text-white text-xs">15% Off</Text>
              <TouchableOpacity className="bg-[#FFE5D0] rounded-full px-3 py-1 mt-2">
                <Text className="text-[#EF4C47] font-medium">Buy Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={STATIC.IMAGES.LOGO}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View> */}

          {/* Top Picks */}
          {/* <View className="mb-10">
            <Text className="text-lg font-bold mb-3">Top Picks for You</Text>
            {[1, 2].map((row) => (
              <View key={row} className="flex-row justify-between mb-4">
                {[1, 2].map((item) => (
                  <View
                    key={item}
                    className="w-[48%] bg-white rounded-xl shadow-sm p-3"
                  >
                    <Image
                      source={STATIC.IMAGES.COMPONENTS.MEDICINE_1}
                      className="w-full h-20 mb-2"
                      resizeMode="contain"
                    />
                    <Text className="font-bold">Derma E</Text>
                    <Text className="text-xs text-gray-600 mb-1">
                      Antiseptic Cream
                    </Text>
                    <Text className="font-semibold mb-2">$5.20</Text>
                    <View className="flex-row justify-between">
                      <TouchableOpacity className="border border-[#EF4C47] rounded px-2 py-1">
                        <Text className="text-xs text-[#EF4C47]">
                          View Detail
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-[#EF4C47] rounded px-2 py-1">
                        <Text className="text-xs text-white">Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
