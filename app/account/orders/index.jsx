import React, { useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import OrderCard from "@/components/cards/OrderCard";
import useAxios from "@/hooks/useAxios";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { request: getAllOrders, loading: loadingOrders } = useAxios();

  const getOrders = async () => {
    const { data, error } = await getAllOrders({
      url: "/user/get-all-orders",
      method: "GET",
      authRequired: true,
    });

    if (!error && data?.status === 200 && data?.data) {
      setOrders(data.data.orders || []);
    } else {
      setOrders([]);
    }

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }
  };

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getOrders();
    setRefreshing(false);
  };

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack showBackButton title="My Orders" />

      <View className="flex-1">
        {loadingOrders && orders.length === 0 ? (
          <View className="px-4 mt-4 gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonOrderCard key={index} />
            ))}
          </View>
        ) : orders.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-500">No orders found.</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <OrderCard order={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          />
        )}
      </View>
    </AppLayout>
  );
}
