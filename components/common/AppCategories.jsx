import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";

const pharmacyCategories = [
  { label: "Tablets", icon: "tablet-portrait-outline" },
  { label: "Syrups", icon: "flask-outline" },
  { label: "Supplements", icon: "nutrition-outline" },
  { label: "First Aid", icon: "medkit-outline" },
  { label: "Personal Care", icon: "people-outline" },
  { label: "Skin Care", icon: "leaf-outline" },
  { label: "Baby Care", icon: "happy-outline" },
  { label: "Medical Devices", icon: "thermometer-outline" },
];

const AppCategories = ({ type = "pharmacy" }) => {
  const router = useRouter();
  const [pathologyCategories, setPathologyCategories] = useState([]);
  const { request: getAllCategories, loading: isLoading } = useAxios();

  const fetchAllCategories = async () => {
    const { data, error } = await getAllCategories({
      method: "GET",
      url:
        type === "pathology"
          ? "/user/get-all-test-category-pathology"
          : "/user/get-all-test-category-pathology",
    });

    if (__DEV__) console.log(`fetching ${type} categories`, data.data, error);
    if (!error && data?.status === 200 && data?.data) {
      setPathologyCategories(data.data.categories || []);
    } else {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, [type]);

  const categories =
    type === "pharmacy" ? pharmacyCategories : pathologyCategories;

  return (
    <View className="mb-6">
      {/* Heading */}
      <Text className="text-lg font-lexend-bold text-text-primary mb-4">
        Categories
      </Text>

      {/* Scrollable Category Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              className="bg-gray-200 rounded-2xl items-center justify-center p-4 w-28 mr-4 animate-pulse"
            >
              <View className="bg-background-soft p-3 rounded-full mb-2">
                <Ionicons name="flask" size={26} color="#6E6A7C" />
              </View>
              <Text className="text-xs text-center font-lexend-medium text-text-primary">
                Loading...
              </Text>
            </View>
          ))
        ) : categories.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 text-sm font-lexend-medium">
              No categories found.
            </Text>
          </View>
        ) : (
          categories.length > 0 &&
          categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              className="bg-white rounded-2xl items-center justify-center p-4 w-28 mr-4"
              onPress={() =>
                router.push({
                  pathname:
                    type === "pharmacy"
                      ? "/pharmacy/category/[categoryId]"
                      : "/pathology/category/[category]",
                  params: { category: cat._id },
                })
              }
            >
              <View className="bg-background-soft p-3 rounded-full mb-2">
                <Ionicons name={"flask"} size={26} color="#6E6A7C" />
              </View>

              <Text className="text-xs text-center font-lexend-medium text-text-primary">
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default AppCategories;
