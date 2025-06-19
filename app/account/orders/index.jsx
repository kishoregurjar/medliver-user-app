import React from "react";
import { View, Text } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import usePaginatedSearchList from "@/hooks/usePaginatedSearchList";
import OrderCard from "@/components/cards/OrderCard";
import SkeletonOrderCard from "@/components/skeletons/SkeletonOrderCard";
import PaginatedList from "@/components/common/PaginatedList";

export default function MyOrdersScreen() {
  const { request: getAllOrders } = useAxios();
  const { request: searchOrders } = useAxios();

  const {
    data: orders,
    searchTerm,
    isSearching,
    initialLoading,
    refreshing,
    loadingMore,
    handleSearchChange,
    handleRefresh,
    loadMore,
    canLoadMore,
  } = usePaginatedSearchList({
    fetchFn: (page) =>
      getAllOrders({
        url: `/user/get-all-orders?page=${page}`,
        method: "GET",
        authRequired: true,
      }),
    searchFn: (params) =>
      searchOrders({
        url: `/user/search-order`,
        method: "GET",
        authRequired: true,
        params,
      }),
    extractList: (res) => res?.data?.data?.orders ?? [],
    extractTotalPages: (res) => res?.data?.data?.totalPages ?? 1,
  });

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack title="My Orders" showBackButton />

      <PaginatedList
        data={orders}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search orders..."
        refreshing={refreshing}
        onRefresh={handleRefresh}
        loading={initialLoading}
        canLoadMore={canLoadMore}
        onLoadMore={loadMore}
        loadingMore={loadingMore}
        renderItem={({ item }) => <OrderCard order={item} />}
        // skeletonComponent={SkeletonOrderCard}
        // contentContainerClassName="bg-white p-4 rounded-2xl gap-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <View className="flex-1 h-full justify-center items-center mt-20">
            <Text className="text-lg text-gray-500 font-lexend-medium">
              No orders found.
            </Text>
          </View>
        }
      />
    </AppLayout>
  );
}
