import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";

const BestSellerPharmacy = () => {
  const router = useRouter();
  const {
    request: fetchBestSellers,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const [products, setProducts] = useState([]);

  const handlePress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchBestSellers({
        method: "GET",
        url: "/user/get-all-top-selling-product?limit=5&page=1&sortOrder=asc",
      });

      if (error) {
        console.error("Error fetching best sellers:", error);
        return;
      }

      if (data?.data?.products) {
        setProducts(data.data.products);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          Best Seller Products
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600 text-sm font-lexend-bold">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-1"
      >
        {isLoading ? (
          // Show 3 skeletons while loading
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPharmacyProductCard key={index} />
          ))
        ) : products.length === 0 ? (
          <View className="h-28 justify-center items-center px-4">
            <Text className="text-gray-400 text-sm font-lexend-medium">
              No Medicine Available
            </Text>
          </View>
        ) : (
          products.map((item) => (
            <PharmacyProductCard
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

export default BestSellerPharmacy;
