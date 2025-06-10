import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";
import { useRouter } from "expo-router";

export default function TopPicksScreen() {
  const router = useRouter();
  const { request: fetchTopPicks, loading: isLoading } = useAxios();
  const [products, setProducts] = useState([]);

  const handlePress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  const fetchData = async () => {
    const { data, error } = await fetchTopPicks({
      method: "GET",
      url: "/user/get-top-picks?limit=20&page=1&sortOrder=asc",
    });

    if (error) {
      console.error("Error fetching top picks:", error);
      return;
    }

    if (data?.status === 200 && data?.data) {
      setProducts(data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="Top Picks" />

      {/* Intro */}
      <View className="py-4 px-1">
        <Text className="text-text-primary font-lexend-semibold text-lg mb-1">
          Handpicked for You
        </Text>
        <Text className="text-text-muted font-lexend-regular text-sm">
          Explore our curated selection of top-picked products tailored to your
          needs.
        </Text>
      </View>

      {/* Product List */}
      <View className="flex-1 px-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPharmacyProductCard key={i} fullWidth />
          ))
        ) : products.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-text-muted font-lexend-medium text-base">
              No top picks found.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <PharmacyProductCard
                item={item}
                fullWidth
                onPress={handlePress}
              />
            )}
            contentContainerStyle={{ paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
}
