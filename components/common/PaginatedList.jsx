import React from "react";
import {
  View,
  FlatList,
  TextInput,
  RefreshControl,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import LoadingDots from "@/components/common/LoadingDots";
import CTAButton from "@/components/common/CTAButton";

export default function PaginatedList({
  data,
  searchTerm = "",
  onSearchChange,
  showSearch = true,
  renderItem,
  keyExtractor = (item, index) => item?._id ?? index.toString(),
  refreshing,
  onRefresh,
  loading,
  ListEmptyComponent,
  ListFooterComponent,
  ListHeaderComponent,
  ItemSeparatorComponent,
  canLoadMore,
  onLoadMore,
  loadingMore,
  skeletonComponent: SkeletonComponent,
  containerClassName = "",
  contentContainerClassName = "rounded-2xl gap-4",
  contentContainerStyle,
  searchPlaceholder = "Search...",
}) {
  const renderFooter = () => {
    if (canLoadMore && onLoadMore) {
      return (
        <CTAButton
          label="Load More"
          onPress={onLoadMore}
          loaderText="Loading..."
          loading={loadingMore}
          disabled={loadingMore}
          size="sm"
        />
      );
    }
    return ListFooterComponent ?? null;
  };

  const renderCombinedHeader = () => (
    <View className="gap-4">
      {/* Sticky Search */}
      {showSearch && (
        <View className="bg-white pb-4">
          <TextInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChangeText={onSearchChange}
            className="px-4 py-4 bg-white rounded-xl border border-background-soft text-gray-700"
          />
        </View>
      )}

      {/* Optional Custom Header */}
      {ListHeaderComponent}

      {/* Result Count */}
      {data.length > 0 && searchTerm.trim().length > 0 && (
        <View>
          <Text className="text-text-muted   font-lexend-semibold text-lg">
            Showing {data.length} {data.length === 1 ? "result" : "results"} for{" "}
            <Text className="text-text-primary font-lexend-bold">
              {`"${searchTerm}"`}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );

  if (loading && data.length === 0) {
    return SkeletonComponent ? (
      <FlatList
        data={Array.from({ length: 5 })}
        keyExtractor={(_, index) => `skeleton-${index}`}
        renderItem={() => <SkeletonComponent />}
        contentContainerClassName={contentContainerClassName}
        contentContainerStyle={contentContainerStyle}
      />
    ) : (
      <View className="flex-1 justify-center items-center mt-10">
        <LoadingDots title="Loading..." subtitle="Please wait..." />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className={`flex-1 ${containerClassName} bg-white p-4 rounded-2xl`}>
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListHeaderComponent={renderCombinedHeader()}
          // stickyHeaderIndices={showSearch ? [0] : undefined}
          ListFooterComponent={renderFooter()}
          ListEmptyComponent={
            data.length === 0 && ListEmptyComponent ? ListEmptyComponent : null
          }
          contentContainerClassName={contentContainerClassName}
          contentContainerStyle={contentContainerStyle}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
