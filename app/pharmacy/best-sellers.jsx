import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";
import { useRouter } from "expo-router";

export default function BestSellersScreen() {
  const router = useRouter();
  const { request: fetchBestSellers, loading: isLoading } = useAxios();
  const [products, setProducts] = useState([]);

  const handlePress = (id) => {
    // Navigate to product details page
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  const fetchData = async () => {
    const { data, error } = await fetchBestSellers({
      method: "GET",
      url: "/user/get-all-top-selling-product?limit=20&page=1&sortOrder=asc",
    });

    if (error) {
      console.error("Error fetching best sellers:", error);
      return;
    }

    if (data?.data?.products) {
      setProducts(data.data.products);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="Best Sellers" />

      {/* Content */}
      <View className="py-4">
        <Text className="text-text-primary font-lexend-semibold text-lg">
          Best Sellers in Pharmacy
        </Text>
        <Text className="text-text-muted font-lexend-regular text-sm">
          Discover the most popular products among our customers. Check out the
          best sellers in pharmacy.
        </Text>
      </View>

      <View className="flex-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPharmacyProductCard key={i} fullWidth />
          ))
        ) : products.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-text-muted font-lexend-medium text-base">
              No best sellers found.
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
            contentContainerStyle={{ paddingBottom: 48, gap: 1 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
}
