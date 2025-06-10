import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";
import { useAuthUser } from "@/contexts/AuthContext";
import ROUTE_PATH from "@/routes/route.constants";

const TopPicksPharmacy = () => {
  const router = useRouter();
  const {
    request: fetchTopPicks,
    loading: isLoading,
    error: hasError,
  } = useAxios();

  const [products, setProducts] = useState([]);
  const { authUser } = useAuthUser();

  const handlePress = (id) => {
    router.push({
      pathname: "/pharmacy/product/[productId]",
      params: { productId: id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchTopPicks({
        method: "GET",
        url: "/user/get-top-picks",
        authRequired: authUser?.token ? true : false,
      });

      if (error) {
        console.error("Error fetching top picks:", error);
        return;
      }

      if (data?.data) {
        setProducts(data.data);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="mb-24">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          Top Picks for You
        </Text>
        <TouchableOpacity
          onPress={() => router.push(ROUTE_PATH.APP.PHARMACY.TOP_PICKS)}
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
        className="pl-1"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPharmacyProductCard key={index} type="small" />
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
              type="small"
              key={item.medicineId || item._id}
              item={item}
              onPress={() => handlePress(item.medicineId || item._id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default TopPicksPharmacy;
