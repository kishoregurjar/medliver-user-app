import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { Ionicons } from "@expo/vector-icons";
import SkeletonPrescriptionCard from "@/components/skeletons/SkeletonPrescriptionCard";
import UserPrescriptionCard from "@/components/cards/UserPrescriptionCard";
import { useRouter } from "expo-router";

export default function MyPrescriptionScreen() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { request: getMyPrescriptions, loading } = useAxios();
  const { request: deletePrescriptionRequest } = useAxios();
  const router = useRouter();

  const fetchMyPrescriptions = async (reset = false) => {
    const currentPage = reset ? 1 : page;

    const { data, error } = await getMyPrescriptions({
      method: "GET",
      url: `/user/get-all-prescriptions?page=${currentPage}`,
      authRequired: true,
    });

    if (error) {
      console.error("Error fetching prescriptions:", error);
      return;
    }

    const fetched = data?.data?.prescriptions ?? [];

    if (reset) {
      setPrescriptions(fetched);
      setPage(2);
    } else {
      setPrescriptions((prev) => [...prev, ...fetched]);
      setPage((prev) => prev + 1);
    }

    setHasMore(fetched.length > 0);
    if (initialLoading) setInitialLoading(false);
  };

  useEffect(() => {
    fetchMyPrescriptions(true);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyPrescriptions(true);
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Prescription",
      "Are you sure you want to delete this prescription?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { data, error } = await deletePrescriptionRequest({
              method: "DELETE",
              url: `/user/delete-prescription/${id}`,
              authRequired: true,
            });

            if (error || data?.status !== 200) {
              Alert.alert("Error", "Failed to delete the prescription.");
              return;
            }

            setPrescriptions((prev) => prev.filter((item) => item._id !== id));
            ToastAndroid.show("Prescription deleted", ToastAndroid.SHORT);
          },
        },
      ]
    );
  };

  const renderPrescription = useCallback(
    ({ item }) => (
      <UserPrescriptionCard
        item={item}
        onPress={() => router.push(`/prescription/${item._id}`)}
        onDelete={() => handleDelete(item._id)}
      />
    ),
    []
  );

  const renderFooter = () => {
    if (!hasMore || prescriptions.length === 0) return null;
    return (
      <TouchableOpacity
        onPress={() => fetchMyPrescriptions()}
        disabled={loading}
        className={`mt-4 mb-6 px-4 py-2 rounded-full items-center ${
          loading ? "bg-brand-primary" : "bg-primary"
        }`}
      >
        <Text
          className={`font-lexend-medium ${
            loading ? "text-gray-500" : "text-white"
          }`}
        >
          {loading ? "Loading..." : "Load More"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="My Prescriptions" />

      <View className="p-4 flex-1">
        {initialLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPrescriptionCard key={index} />
          ))
        ) : prescriptions.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text className="text-lg text-gray-500 mt-4 font-lexend-medium">
              No prescriptions found
            </Text>
          </View>
        ) : (
          <FlatList
            data={prescriptions}
            keyExtractor={(item) => item._id}
            renderItem={renderPrescription}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </AppLayout>
  );
}
