import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
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

const OffersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { request: getSpecialOffers } = useAxios();

  const [offers, setOffers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isMountedRef = useRef(false);

  const fetchOffers = async ({
    page = 1,
    isRefresh = false,
    isLoadMore = false,
  } = {}) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (isLoadMore) setLoadingMore(true);
      else setInitialLoading(true);

      const { data, error } = await getSpecialOffers({
        url: `/user/get-all-banners?isActive=true&limit=10&page=${page}`,
        method: "GET",
      });

      if (!error && data?.data) {
        const newOffers = data.data.banners || [];

        setOffers((prev) => (isLoadMore ? [...prev, ...newOffers] : newOffers));

        setCurrentPage(data.data.currentPage || 1);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch offers", err);
    } finally {
      if (isRefresh) setRefreshing(false);
      if (isLoadMore) setLoadingMore(false);
      setInitialLoading(false);
    }
  };

  const handlePress = (item) => {
    if (item.path?.startsWith("/")) {
      router.push(item.path);
    } else if (item.redirectUrl?.startsWith("http")) {
      Linking.openURL(item.redirectUrl);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchOffers({ page: currentPage + 1, isLoadMore: true });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isMountedRef.current) {
        fetchOffers();
        isMountedRef.current = true;
      }
    }, [])
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Offers" />

      <ScrollView
        className="mt-4 flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setCurrentPage(1);
              fetchOffers({ page: 1, isRefresh: true });
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        showsVerticalScrollIndicator={false}
      >
        {initialLoading ? (
          <View className="my-6">
            <ActivityIndicator size="large" color="#B31F24" />
            <Text className="text-center text-text-muted font-lexend-medium mt-2">
              Loading offers...
            </Text>
          </View>
        ) : offers.length > 0 ? (
          <>
            {offers.map((offer) => (
              <TouchableOpacity
                key={offer._id}
                onPress={() => handlePress(offer)}
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
                          Valid till{" "}
                          {dayjs(offer.endDate).format("MMM D, YYYY")}
                        </Text>
                      </View>
                    )}

                    {offer.bannerImageUrl && (
                      <Image
                        source={{ uri: offer.bannerImageUrl }}
                        className="w-full h-40 mt-4 rounded-lg"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {currentPage < totalPages && (
              <CTAButton
                label="Load More"
                loaderText="Loading..."
                size="sm"
                onPress={handleLoadMore}
                disabled={loadingMore}
                loading={loadingMore}
              />
            )}
          </>
        ) : (
          <Text className="text-center text-text-muted font-lexend-medium mt-10">
            No active offers available.
          </Text>
        )}
      </ScrollView>
    </AppLayout>
  );
};

export default OffersScreen;
