import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAxios from "@/hooks/useAxios";
import { useRouter, useFocusEffect } from "expo-router";
import STATIC from "@/utils/constants";
import dayjs from "dayjs";
import CTAButton from "@/components/common/CTAButton";
import LoadingDots from "@/components/common/LoadingDots";

const OfferCard = React.memo(({ offer, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(offer)}
    activeOpacity={0.8}
    className="p-4 mb-4 border-b border-text-muted/50"
  >
    <View className="flex-row items-start">
      <Image
        source={STATIC.IMAGES.APP.LOGO}
        className="w-12 h-12 rounded-md mr-3"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className="text-lg font-lexend-bold text-text-primary">
          {offer.title}
        </Text>
        <Text className="text-sm font-lexend text-text-muted mt-1">
          {offer.description}
        </Text>

        {offer.endDate && (
          <View className="bg-green-100 px-2 py-0.5 mt-2 self-start rounded-md">
            <Text className="text-xs text-green-800 font-lexend-medium">
              Valid till {dayjs(offer.endDate).format("MMM D, YYYY")}
            </Text>
          </View>
        )}

        {!!offer.bannerImageUrl && (
          <Image
            source={{ uri: offer.bannerImageUrl }}
            className="w-full h-40 mt-4 rounded-lg"
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  </TouchableOpacity>
));

const OffersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { request: getSpecialOffers } = useAxios();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOffers = useCallback(
    async ({ page = 1, isRefresh = false, isLoadMore = false } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const { data, error } = await getSpecialOffers({
          url: `/user/get-all-banners?isActive=true&limit=10&page=${page}`,
          method: "GET",
        });

        if (!error && data?.data) {
          const newOffers = data.data.banners || [];
          setOffers((prev) =>
            isLoadMore ? [...prev, ...newOffers] : newOffers
          );
          setPage(data.data.currentPage || 1);
          setTotalPages(data.data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch offers", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const handlePress = useCallback((item) => {
    if (item.path?.startsWith("/")) {
      router.push(item.path);
    } else if (item.redirectUrl?.startsWith("http")) {
      Linking.openURL(item.redirectUrl);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setPage(1);
    fetchOffers({ page: 1, isRefresh: true });
  }, [fetchOffers]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loadingMore) {
      fetchOffers({ page: page + 1, isLoadMore: true });
    }
  }, [page, totalPages, loadingMore, fetchOffers]);

  useFocusEffect(
    useCallback(() => {
      fetchOffers();
    }, [fetchOffers])
  );

  const renderFooter = () => {
    if (page < totalPages) {
      return (
        <CTAButton
          label="Load More"
          loaderText="Loading..."
          size="sm"
          onPress={loadMore}
          disabled={loadingMore}
          loading={loadingMore}
          className="mb-6"
        />
      );
    }
    return null;
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Offers" />
      {loading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots
            title={"Loading Offers... "}
            subtitle={"Please wait..."}
          />
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={offers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <OfferCard offer={item} onPress={handlePress} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text className="text-center text-text-muted font-lexend-medium mt-10">
                No active offers available.
              </Text>
            }
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </AppLayout>
  );
};

export default OffersScreen;
