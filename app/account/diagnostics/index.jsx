import React from "react";
import { View, Text } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import usePaginatedSearchList from "@/hooks/usePaginatedSearchList";
import DiagnosticsOrderCard from "@/components/cards/DiagnosticsOrderCard";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import PaginatedList from "@/components/common/PaginatedList";

export default function MyDiagnosticsScreen() {
  const { request: fetchDiagnosticsOrders } = useAxios();
  const { request: searchDiagnosticsOrders } = useAxios();

  const {
    data: orders,
    searchTerm,
    initialLoading,
    refreshing,
    loadingMore,
    handleSearchChange,
    handleRefresh,
    loadMore,
    canLoadMore,
  } = usePaginatedSearchList({
    fetchFn: (page) =>
      fetchDiagnosticsOrders({
        method: "GET",
        url: `/user/get-orders-pathology?page=${page}`,
        authRequired: true,
      }),
    searchFn: (params) =>
      searchDiagnosticsOrders({
        method: "GET",
        url: `/user/search-orders-pathology`,
        authRequired: true,
        params,
      }),
    extractList: (res) => res?.data?.data?.orders ?? [],
    extractTotalPages: (res) => res?.data?.data?.totalPages ?? 1,
  });

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack showBackButton title="My Diagnostics" />

      <PaginatedList
        data={orders}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search diagnostics..."
        refreshing={refreshing}
        onRefresh={handleRefresh}
        loading={initialLoading}
        canLoadMore={canLoadMore}
        onLoadMore={loadMore}
        loadingMore={loadingMore}
        renderItem={({ item }) => <DiagnosticsOrderCard order={item} />}
        // skeletonComponent={SkeletonOrderCard}
        // contentContainerClassName="bg-white p-4 rounded-2xl gap-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <View className="flex-1 h-full items-center justify-center mt-20">
            <Text className="text-gray-500 text-base">
              No diagnostics found.
            </Text>
          </View>
        }
      />
    </AppLayout>
  );
}
