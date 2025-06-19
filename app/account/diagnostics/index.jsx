import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TextInput, RefreshControl } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect } from "expo-router";
import useAxios from "@/hooks/useAxios";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import DiagnosticsOrderCard from "@/components/cards/DiagnosticsOrderCard";
import debounce from "lodash.debounce";
import LoadingDots from "@/components/common/LoadingDots";
import CTAButton from "@/components/common/CTAButton";

export default function MyDiagnosticsScreen() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const { request: fetchDiagnosticsOrders, loading: loadingOrders } =
    useAxios();
  const { request: searchDiagnosticsOrders, loading: loadingSearch } =
    useAxios();

  const fetchOrders = async (reset = false) => {
    const pageToFetch = reset ? 1 : currentPage;
    const { data, error } = await fetchDiagnosticsOrders({
      method: "GET",
      url: `/user/get-orders-pathology?page=${pageToFetch}`,
      authRequired: true,
    });

    console.log(data.data);

    const fetched = data?.data ?? [];
    const totalFromApi = data?.data?.totalPages ?? 1;

    if (error) {
      console.error("Diagnostics fetch error:", error);
      if (reset) setOrders([]);
      return;
    }

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

  const fetchSearchResults = async (query) => {
    const { data, error } = await searchDiagnosticsOrders({
      method: "GET",
      url: `/user/search-orders-pathology`,
      authRequired: true,
      params: { value: query },
    });

    if (!error && data?.status === 200) {
      setOrders(data.data.orders ?? []);
    } else {
      console.error("Search error:", error);
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
        fetchOrders(true);
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
      await fetchOrders(true);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      fetchOrders(true);
      return () => debouncedSearch.cancel();
    }, [])
  );

  const isLoading =
    (initialLoading || (isSearching && loadingSearch)) && orders.length === 0;

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack showBackButton title="My Diagnostics" />

      {/* 🔍 Search Input */}
      <View>
        <TextInput
          placeholder="Search diagnostics..."
          value={search}
          onChangeText={handleSearchChange}
          className="my-4 px-4 py-4 bg-white rounded-xl border border-background-soft text-gray-700"
        />
      </View>

      {/* 🧭 Loader */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots
            title="Loading Diagnostics..."
            subtitle="Please wait..."
          />
        </View>
      ) : (
        <FlatList
          data={orders}
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
