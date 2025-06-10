import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";
import PathologyTestCard from "@/components/cards/PathologyTestCard";
import SkeletonPathologyTestCard from "@/components/skeletons/SkeletonPathologyTestCard";

export default function PopularTestsScreen() {
  const router = useRouter();
  const { request: getPopularTests, loading: isLoading } = useAxios();
  const [popularTests, setPopularTests] = useState([]);

  const handlePress = (id) => {
    router.push({
      pathname: ROUTE_PATH.APP.PATHOLOGY.LAB_TEST_DETAILS,
      params: { testId: id },
    });
  };

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="Popular Tests" />

      {/* Description */}
      <View className="py-4">
        <Text className="text-text-primary font-lexend-semibold text-lg mb-1">
          Popular Lab Tests
        </Text>
        <Text className="text-text-muted font-lexend-regular text-sm">
          Explore the most frequently booked lab tests by our users.
        </Text>
      </View>

      {/* Test List */}
      <View className="flex-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <View className="mb-4" key={index}>
              <SkeletonPathologyTestCard fullWidth />
            </View>
          ))
        ) : popularTests.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-text-muted font-lexend-medium text-base">
              No popular tests found.
            </Text>
          </View>
        ) : (
          <FlatList
            data={popularTests}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <PathologyTestCard item={item} fullWidth onPress={handlePress} />
            )}
            contentContainerStyle={{ paddingBottom: 48 }}
            ItemSeparatorComponent={() => <View className="h-2" />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
}
