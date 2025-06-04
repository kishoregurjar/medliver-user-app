import React, { useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import useAxios from "@/hooks/useAxios";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import DiagnosticsOrderCard from "@/components/cards/DiagnosticsOrderCard"; // 👈 Create this
import CTAButton from "@/components/common/CTAButton";

export default function MyDiagnosticsScreen() {
  const [orders, setOrders] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { request: fetchDiagnosticsOrders, loading: loadingDiagnostics } =
    useAxios();

  const fetchOrders = async () => {
    const { data, error } = await fetchDiagnosticsOrders({
      method: "GET",
      url: "/user/get-orders-pathology",
      authRequired: true,
    });

    if (!error && data?.status === 200) {
      setOrders(data.data ?? []);
    } else {
      console.error("Diagnostics fetch error:", error);
      setOrders([]);
    }

    setInitialLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      fetchOrders();
    }, [])
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="My Diagnostics" />
      <FlatList
        data={
          initialLoading && orders.length === 0
            ? Array.from({ length: 5 })
            : orders
        }
        keyExtractor={(item, index) =>
          item?._id ? item._id : `skeleton-${index}`
        }
        renderItem={({ item }) =>
          item?._id ? (
            <DiagnosticsOrderCard order={item} />
          ) : (
            <SkeletonOrderCard />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32,
          gap: 12,
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={
          !initialLoading &&
          orders.length === 0 && (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-gray-500 text-base">
                No diagnostics found.
              </Text>
            </View>
          )
        }
      />
    </AppLayout>
  );
}
