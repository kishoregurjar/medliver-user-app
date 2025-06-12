import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  ToastAndroid,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { Ionicons } from "@expo/vector-icons";
import SkeletonPrescriptionCard from "@/components/skeletons/SkeletonPrescriptionCard";
import UserPrescriptionCard from "@/components/cards/UserPrescriptionCard";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import CTAButton from "@/components/common/CTAButton";
import LoadingDots from "@/components/common/LoadingDots";

export default function MyPrescriptionScreen() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState("");

  const debouncedSearch = useCallback(
    debounce((text) => fetchMyPrescriptions(true), 500),
    []
  );

  const { request: getMyPrescriptions, loading } = useAxios();
  const { request: deletePrescriptionRequest } = useAxios();
  const router = useRouter();

  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const fetchMyPrescriptions = async (reset = false) => {
    const pageToFetch = reset ? 1 : currentPage;

    const { data, error } = await getMyPrescriptions({
      method: "GET",
      url: `/user/get-all-prescriptions?page=${pageToFetch}`,
      authRequired: true,
    });

    if (error) {
      console.error("Error fetching prescriptions:", error);
      return;
    }

    const fetched = data?.data?.prescriptions ?? [];
    const totalPagesFromApi = data?.data?.totalPages ?? 1;

    if (reset) {
      setPrescriptions(fetched);
      setCurrentPage(2); // Start from next page
    } else {
      setPrescriptions((prev) => [...prev, ...fetched]);
      setCurrentPage((prev) => prev + 1);
    }

    setTotalPages(totalPagesFromApi);
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

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="My Prescriptions" />

      <View className="flex-1">
        {/* Search Bar */}
        <TextInput
          placeholder="Search Prescriptions..."
          value={search}
          onChangeText={handleSearchChange}
          className="my-4 px-4 py-4 bg-white rounded-xl border border-background-soft text-gray-700"
        />

        {initialLoading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <LoadingDots
              title={"Loading Prescriptions... "}
              subtitle={"Please wait..."}
            />
          </View>
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
            renderItem={({ item }) => {
              return (
                <UserPrescriptionCard
                  item={item}
                  onPress={() => {
                    router.push(`/account/prescriptions/${item._id}`);
                  }}
                  onDelete={() => handleDelete(item._id)}
                />
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            contentContainerClassName="bg-white p-4 rounded-2xl gap-4"
            ListFooterComponent={
              currentPage <= totalPages && prescriptions.length > 0 ? (
                <CTAButton
                  label="Load More"
                  onPress={() => fetchMyPrescriptions()}
                  loaderText="Loading..."
                  loading={loading}
                  disabled={loading}
                />
              ) : null
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
