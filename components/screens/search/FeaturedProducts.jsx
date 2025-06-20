import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const { request: fetchFeaturedProducts, loading } = useAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await fetchFeaturedProducts({
        method: "GET",
        url: "/user/get-all-feature-product?page=1",
      });

      if (!error && data?.status === 200) {
        setProducts(data.data.featuredProducts);
      }
    };

    fetchProducts();
  }, []);

  const handlePressProduct = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
        Featured Products
      </Text>

      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[...Array(3)].map((_, index) => (
            <SkeletonPharmacyProductCard key={index} />
          ))}
        </ScrollView>
      ) : products.length === 0 ? (
        <View className="h-28 justify-center items-center px-4">
          <Text className="text-gray-400 text-sm font-lexend-medium">
            No products found.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.map((item) => (
            <PharmacyProductCard
              key={item._id}
              item={item}
              onPress={() => handlePressProduct(item.product._id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
