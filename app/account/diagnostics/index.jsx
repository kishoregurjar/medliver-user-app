import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TextInput, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import useAxios from "@/hooks/useAxios";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import DiagnosticsOrderCard from "@/components/cards/DiagnosticsOrderCard";
import debounce from "lodash.debounce";

export default function MyDiagnosticsScreen() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { request: fetchDiagnosticsOrders, loading: loadingDiagnostics } =
    useAxios();
  const { request: searchDiagnosticsOrders, loading: loadingSearch } =
    useAxios();

  // 🔍 Fetch all diagnostics
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

  // 🔍 Search diagnostics by keyword
  const fetchSearchResults = async (query) => {
    const { data, error } = await searchDiagnosticsOrders({
      method: "GET",
      url: `/user/search-orders-pathology`,
      authRequired: true,
      params: { value: query },
    });

    if (!error && data?.status === 200) {
      setOrders(data.data?.orders ?? []);
    } else {
      console.error("Diagnostics search error:", error);
      setOrders([]);
    }
  };

  // 🕵️‍♂️ Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        setIsSearching(true);
        fetchSearchResults(value.trim());
      } else {
        setIsSearching(false);
        fetchOrders();
      }
    }, 500),
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
    }, [])
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="My Diagnostics" />
      <View className="px-4">
        {/* Search Bar */}
        <TextInput
          placeholder="Search diagnostics..."
          value={search}
          onChangeText={handleSearchChange}
          className="my-4 px-4 py-4 bg-white rounded-xl border border-background-soft text-gray-700"
        />
      </View>

      <FlatList
        data={
          (initialLoading || loadingSearch) && orders.length === 0
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
