import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import useAxios from "@/hooks/useAxios";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import DiagnosticsOrderCard from "@/components/cards/DiagnosticsOrderCard";
import debounce from "lodash.debounce";
import LoadingDots from "@/components/common/LoadingDots";

export default function MyDiagnosticsScreen() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { request: fetchDiagnosticsOrders } = useAxios();
  const { request: searchDiagnosticsOrders } = useAxios();

  const fetchOrders = async () => {
    try {
      const { data } = await fetchDiagnosticsOrders({
        method: "GET",
        url: "/user/get-orders-pathology",
        authRequired: true,
      });

      setOrders(data?.data ?? []);
    } catch (error) {
      console.error("Diagnostics fetch error:", error);
      setOrders([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchSearchResults = async (query) => {
    try {
      const { data } = await searchDiagnosticsOrders({
        method: "GET",
        url: `/user/search-orders-pathology`,
        authRequired: true,
        params: { value: query },
      });

      setOrders(data?.data?.orders ?? []);
    } catch (error) {
      console.error("Diagnostics search error:", error);
      setOrders([]);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        setIsSearching(true);
        fetchSearchResults(value.trim());
      } else {
        setIsSearching(false);
        fetchOrders();
      }
    }, 400),
    []
  );

  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (isSearching && search.trim()) {
      await fetchSearchResults(search.trim());
    } else {
      await fetchOrders();
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      fetchOrders();

      return () => debouncedSearch.cancel(); // cleanup debounce on unmount
    }, [])
  );

  const isLoading = initialLoading || (isSearching && !orders.length);

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="My Diagnostics" />

      {/* Search Input */}
      <View>
        <TextInput
          placeholder="Search diagnostics..."
          value={search}
          onChangeText={handleSearchChange}
          className="my-4 px-4 py-4 bg-white rounded-2xl border border-background-soft text-gray-700"
        />
      </View>

      {isLoading && (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots
            title="Loading Diagnostics..."
            subtitle="Please wait..."
          />
        </View>
      )}

      {!isLoading && (
        <FlatList
          data={orders.length > 0 ? orders : []}
          keyExtractor={(item, index) => item?._id ?? `skeleton-${index}`}
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
          contentContainerClassName="bg-white p-4 rounded-2xl gap-4"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-gray-500 text-base">
                No diagnostics found.
              </Text>
            </View>
          }
        />
      )}
    </AppLayout>
  );
}
