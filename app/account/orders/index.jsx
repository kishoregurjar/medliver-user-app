import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import useAxios from "@/hooks/useAxios";
import OrderCard from "@/components/cards/OrderCard";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { request: getAllOrders, loading: loadingOrders } = useAxios();

  const fetchOrders = async (reset = false) => {
    const pageToFetch = reset ? 1 : currentPage;
    const { data, error } = await getAllOrders({
      url: `/user/get-all-orders?page=${pageToFetch}`,
      method: "GET",
      authRequired: true,
    });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    const fetched = data?.data?.orders ?? [];
    const totalFromApi = data?.data?.totalPages ?? 1;

    if (reset) {
      setOrders(fetched);
      setCurrentPage(2);
    } else {
      setOrders((prev) => [...prev, ...fetched]);
      setCurrentPage((prev) => prev + 1);
    }

    setTotalPages(totalFromApi);
    setInitialLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders(true);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders(true);
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    const lower = text.toLowerCase();
    setFilteredOrders(
      orders.filter((order) => order?.orderId?.toLowerCase().includes(lower))
    );
  };

  const visibleOrders = search ? filteredOrders : orders;

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack showBackButton title="My Orders" />
      <View className="flex-1 px-4">
        {/* Search Bar */}
        <TextInput
          placeholder="Search orders..."
          value={search}
          onChangeText={handleSearch}
          className="my-4 px-4 py-4 bg-white rounded-xl border border-background-soft text-gray-700"
        />

        {/* Order List */}
        <FlatList
          data={
            initialLoading && orders.length === 0
              ? Array.from({ length: 5 })
              : visibleOrders
          }
          keyExtractor={(item, index) =>
            item?._id ? item._id : `skeleton-${index}`
          }
          renderItem={({ item }) =>
            item?._id ? <OrderCard order={item} /> : <SkeletonOrderCard />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32,
            gap: 12,
          }}
          ListFooterComponent={
            !initialLoading &&
            currentPage <= totalPages &&
            visibleOrders.length > 0 ? (
              <TouchableOpacity
                onPress={() => fetchOrders()}
                disabled={loadingOrders}
                className={`mt-4 mb-6 px-4 py-2 rounded-full items-center ${
                  loadingOrders ? "bg-brand-primary/50" : "bg-brand-primary"
                }`}
              >
                <Text
                  className={`font-lexend-medium ${
                    loadingOrders ? "text-gray-500" : "text-white"
                  }`}
                >
                  {loadingOrders ? "Loading..." : "Load More"}
                </Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            !initialLoading && (
              <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-gray-500 text-base">
                  No orders found.
                </Text>
              </View>
            )
          }
        />
      </View>
    </AppLayout>
  );
}
