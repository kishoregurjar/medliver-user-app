import useAxios from "@/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import PathologyTestCard from "@/components/cards/PathologyTestCard";
import SkeletonPathologyTestCard from "@/components/skeletons/SkeletonPathologyTestCard";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";

const PopularTestPathology = () => {
  const router = useRouter();

  const { request: getPopularTests, loading: isLoading } = useAxios();
  const [popularTests, setPopularTests] = useState([]);

  const handlePress = (id) => {
    router.push({
      pathname: ROUTE_PATH.APP.PATHOLOGY.LAB_TEST_DETAILS,
      params: { testId: id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getPopularTests({
        method: "GET",
        url: "/user/get-popular-test",
        authRequired: true,
      });

      if (error) {
        console.error("Error fetching popular tests:", error);
        return;
      }

      if (data?.data?.tests) {
        setPopularTests(data.data.tests);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="mb-24">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 px-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          Popular Lab Tests
        </Text>
        <TouchableOpacity
          onPress={() => router.push(ROUTE_PATH.APP.PATHOLOGY.POPULAR_TESTS)}
        >
          <Text className="text-blue-600 text-sm font-lexend-bold">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {isLoading ? (
          // Show 3 skeletons while loading
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPathologyTestCard key={index} />
          ))
        ) : popularTests.length === 0 ? (
          <View className="h-28 justify-center items-center px-4">
            <Text className="text-gray-400 text-sm font-lexend-medium">
              No popular tests found.
            </Text>
          </View>
        ) : (
          popularTests.map((item) => (
            <PathologyTestCard
              key={item._id}
              item={item}
              onPress={handlePress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default PopularTestPathology;
