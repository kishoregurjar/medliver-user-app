import React from "react";
import { View, Text } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { Ionicons } from "@expo/vector-icons";
import UserPrescriptionCard from "@/components/cards/UserPrescriptionCard";
import { useRouter } from "expo-router";
import usePaginatedSearchList from "@/hooks/usePaginatedSearchList";
import PaginatedList from "@/components/common/PaginatedList";
import SkeletonPrescriptionCard from "@/components/skeletons/SkeletonPrescriptionCard";

export default function MyPrescriptionScreen() {
  const router = useRouter();
  const { request: getPrescriptions } = useAxios();
  const { request: searchPrescription } = useAxios();

  const {
    data: prescriptions,
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
      getPrescriptions({
        method: "GET",
        url: `/user/get-all-prescriptions?page=${page}`,
        authRequired: true,
      }),
    searchFn: (params) =>
      searchPrescription({
        method: "GET",
        url: `/user/search-prescription`,
        authRequired: true,
        params,
      }),
    extractList: (res) => res?.data?.data?.prescriptions ?? [],
    extractTotalPages: (res) => res?.data?.data?.totalPages ?? 1,
  });

  return (
    <AppLayout scroll={false} className="flex-1">
      <HeaderWithBack showBackButton title="My Prescriptions" />

      <PaginatedList
        data={prescriptions}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        loading={initialLoading}
        canLoadMore={canLoadMore}
        onLoadMore={loadMore}
        loadingMore={loadingMore}
        searchPlaceholder="Search Prescriptions..."
        renderItem={({ item }) => (
          <UserPrescriptionCard
            item={item}
            onPress={() => router.push(`/account/prescriptions/${item._id}`)}
            // You can pass onDelete if needed
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 h-full justify-center items-center mt-20">
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text className="text-lg text-gray-500 mt-4 font-lexend-medium">
              No prescriptions found
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        // skeletonComponent={SkeletonOrderCard}
        // contentContainerClassName="bg-white p-4 rounded-2xl gap-4"
      />
    </AppLayout>
  );
}
