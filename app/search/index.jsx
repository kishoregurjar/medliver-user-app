import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

export default function SearchMedicineScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const suggestions = ["Paracetamol", "Ibuprofen", "Cough Syrup"];

  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack title="Search Medicines" clearStack backTo={"/home"} />

      {/* Body */}
      <View className="flex-1 px-5 pt-4">
        <TextInput
          className="border rounded-xl p-3 mb-4"
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
        />
        {suggestions.map((item) => (
          <TouchableOpacity
            key={item}
            className="p-4 border-b border-gray-100"
            onPress={() =>
              router.replace({
                pathname: "/pharmacy",
                params: { query: item },
              })
            }
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </AppLayout>
  );
}
