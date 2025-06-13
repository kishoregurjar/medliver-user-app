import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useLocalSearchParams } from "expo-router";
import useAxios from "@/hooks/useAxios";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function PathologyTestsByCategoryScreen() {
  const { categoryId } = useLocalSearchParams();
  const { request: getTestsByCategory, loading } = useAxios();
  const [category, setCategory] = useState(null);
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    const { data, error } = await getTestsByCategory({
      method: "GET",
      url: `/user/get-tests-by-category?categoryId=${categoryId}`,
    });

    if (!error && data?.status === 200) {
      setCategory(data.data.category);
      setTests(data.data.tests || []);
    } else {
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [categoryId]);

  const renderTestCard = ({ item }) => (
    <View className="bg-white rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="flask-outline" size={20} color="#5C59FF" />
        <Text className="ml-2 text-base font-lexend-semibold text-text-primary" numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <Text className="text-xs text-text-secondary font-lexend mb-1">
        {item.description}
      </Text>

      <View className="flex-row justify-between mt-2">
        <View>
          <Text className="text-xs font-lexend text-gray-500">
            Sample:{" "}
            <Text className="text-text-primary font-lexend-medium">
              {item.sample_required}
            </Text>
          </Text>
          <Text className="text-xs font-lexend text-gray-500">
            Prep:{" "}
            <Text className="text-text-primary font-lexend-medium">
              {item.preparation}
            </Text>
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-base font-lexend-semibold text-primary">
            ₹{item.price}
          </Text>
          {item.available_at_home && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="home-outline" size={14} color="#4CAF50" />
              <Text className="ml-1 text-xs font-lexend text-green-500">
                At Home
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Pathology Lab Tests" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#5C59FF" />
          <Text className="text-text-primary font-lexend mt-2">
            Loading tests...
          </Text>
        </View>
      ) : (
        <View className="flex-1 px-4 py-2">
          {category && (
            <View className="mb-4">
              <Image
                source={{ uri: category.image_url }}
                className="w-full h-40 rounded-xl mb-2"
                resizeMode="cover"
              />
              <Text className="text-lg font-lexend-semibold text-text-primary mb-1">
                {category.name}
              </Text>
              <Text className="text-sm font-lexend text-text-secondary">
                {category.description}
              </Text>
            </View>
          )}

          {tests.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-text-secondary text-sm font-lexend-medium">
                No tests available for this category.
              </Text>
            </View>
          ) : (
            <FlatList
              data={tests}
              keyExtractor={(item) => item._id}
              renderItem={renderTestCard}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </AppLayout>
  );
}
