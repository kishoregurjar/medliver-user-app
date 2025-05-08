import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
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
    <AppLayout scrollEnabled={false}>
      {/* Header with back button */}
      <HeaderWithBack title="Select Address" clearStack backTo={"/home"} />

      {/* Body */}
      <View className="flex-1 px-5 pt-4">
        <TextInput
          className="border rounded-xl p-3 mb-4"
          placeholder="Search address"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 border-b border-gray-200"
              onPress={() => {
                router.replace({
                  pathname: "/pharmacy",
                  params: { selectedAddress: item },
                });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </AppLayout>
  );
}
