import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

const addresses = [
  "Indore, Madhya Pradesh",
  "Bhopal",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Pune",
];

export default function SelectAddressScreen() {
  const router = useRouter();
  const { selected } = useLocalSearchParams();
  const [search, setSearch] = useState("");

  const filtered = addresses.filter((addr) =>
    addr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout scroll={false}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <HeaderWithBack
          showBackButton
          title="Select Address"
          clearStack
          backTo="/home"
        />

        {/* Body */}
        <View className="flex-1 pt-4">
          {/* Search Field */}
          <View className="flex-row items-center bg-white border border-background-soft px-4 py-3 rounded-xl mb-4">
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Search address"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>

          {/* Address List */}
          <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
            Select Address
          </Text>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View className="h-1" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row justify-between items-center px-4 py-4 bg-white rounded-lg"
                onPress={() =>
                  router.replace({
                    pathname: "/pharmacy",
                    params: { selectedAddress: item },
                  })
                }
              >
                <Text className="text-base font-lexend text-gray-800">{item}</Text>
                {selected === item && (
                  <Ionicons name="checkmark" size={20} color="#22c55e" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </AppLayout>
  );
}
