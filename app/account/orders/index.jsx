import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TextInput, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import useAxios from "@/hooks/useAxios";
import OrderCard from "@/components/cards/OrderCard";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import debounce from "lodash.debounce";
import CTAButton from "@/components/common/CTAButton";
import LoadingDots from "@/components/common/LoadingDots";

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { request: getAllOrders, loading: loadingOrders } = useAxios();
  const { request: searchOrders, loading: loadingSearch } = useAxios();

  // 📦 Fetch paginated orders
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

  // 🔍 Fetch orders via search
  const fetchSearchResults = async (query) => {
    const { data, error } = await searchOrders({
      url: `/user/search-order?value=${query}`,
      method: "GET",
      authRequired: true,
    });

    if (!error && data?.status === 200 && data?.data) {
      setOrders(data.data.orders ?? []);
    } else {
      console.error("Search error:", error);
      setOrders([]);
    }
  };

  // 🔁 Debounced Search
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        setIsSearching(true);
        fetchSearchResults(value.trim());
      } else {
        setIsSearching(false);
        fetchOrders(true); // fallback
      }
    }, 500),
    []
  );

  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedSearch(text);
  };

  // 🌀 Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    if (isSearching && search.trim()) {
      await fetchSearchResults(search.trim());
    } else {
      await fetchOrders(true);
    }
    setRefreshing(false);
  };

  // 🚀 Initial load
  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      fetchOrders(true);
      return () => debouncedSearch.cancel(); // cleanup
    }, [])
  );

  const isLoading =
    (initialLoading || (isSearching && loadingSearch)) && orders.length === 0;

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack showBackButton title="My Orders" />

      {/* 🔍 Search Bar */}
      <View>
        <TextInput
          placeholder="Search orders..."
          value={search}
          onChangeText={handleSearchChange}
          className="my-4 px-4 py-4 bg-white rounded-xl border border-background-soft text-gray-700"
        />
      </View>

      {/* 🧭 Loader */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots title="Loading Orders..." subtitle="Please wait..." />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => item?._id ?? `skeleton-${index}`}
          renderItem={({ item }) =>
            item?._id ? <OrderCard order={item} /> : <SkeletonOrderCard />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerClassName="bg-white px-4 py-4 rounded-2xl gap-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          ListFooterComponent={
            !isSearching &&
            currentPage <= totalPages &&
            orders.length > 0 && (
              <CTAButton
                label="Load More"
                onPress={() => fetchOrders()}
                loaderText="Loading..."
                loading={loadingOrders}
                disabled={loadingOrders}
                size="sm"
              />
            )
          }
          ListEmptyComponent={
            orders.length === 0 && (
              <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-gray-500 text-base">
                  No orders found.
                </Text>
              </View>
            )
          }
        />
      )}
    </AppLayout>
  );
}
