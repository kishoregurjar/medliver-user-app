import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";

export default function SearchMedicineScreen() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const {
    request: searchMedicines,
    loading: isLoading,
    error: hasError,
  } = useAxios();
  const {
    request: fetchFeaturedProducts,
    loading: isFeaturedLoading,
    error: hasFeaturedError,
  } = useAxios();

  const categories = [
    "Pain Relief",
    "Cough & Cold",
    "Vitamins",
    "Diabetes",
    "Heart Care",
  ];

  const handleSearch = async (searchTerm) => {
    if (!searchTerm?.trim()) return;

    const { data, error } = await searchMedicines({
      method: "GET",
      url: `/user/search-medicine?query=${searchTerm}&page=1`,
    });
    if (error) {
      console.error("Search error:", error);
      return;
    }
    if (data?.data?.data) {
      setProducts(data.data.data);
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await fetchFeaturedProducts({
        method: "GET",
        url: "/user/get-all-feature-product?page=1",
      });

      if (error) {
        console.error("Error fetching featured products:", error);
        return;
      }

      if (data?.data?.featuredProducts) {
        setProducts(data.data.featuredProducts);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <AppLayout scroll={false}>
      <SafeAreaView className="flex-1">
        <HeaderWithBack
          showBackButton
          title="Search Medicines"
          clearStack
          backTo="/home"
        />

        {/* Fixed Search Bar */}
        <View className="pt-4">
          <View className="flex-row items-center bg-white border border-background-soft px-4 py-3 rounded-xl">
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Search for medicines"
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                handleSearch(text);
              }}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 pt-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Categories */}
          {query.length === 0 && (
            <View className="mb-6">
              <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
                Categories
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-brand-primary/10 border border-brand-primary/90 px-4 py-2 rounded-full mr-3"
                    onPress={() => {
                      setQuery(category);
                      handleSearch(category);
                    }}
                  >
                    <Text className="text-brand-primary text-sm font-lexend-medium">
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Products Section */}
          <View className="mb-6">
            {query?.length > 0 ? (
              <View className="bg-white rounded-2xl p-4">
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <>
                      {/* Skeleton for list of products */}
                      <View className="animate-pulse flex-row items-center border-b border-background-soft p-2 mb-4">
                        <View className="flex-1">
                          <View className="h-4 w-full bg-gray-300 rounded mb-2"></View>
                          <View className="h-4 w-3/4 bg-gray-300 rounded"></View>
                        </View>
                      </View>
                    </>
                  ))
                ) : products.length === 0 ? (
                  <View className="h-28 justify-center items-center px-4">
                    <Text className="text-gray-400 text-sm font-lexend-medium">
                      No products found for "{query}".
                    </Text>
                  </View>
                ) : (
                  products.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      className="border-b border-background-soft p-1 mb-4 flex-row items-center"
                      onPress={() =>
                        router.push({
                          pathname: "/pharmacy/product/[productId]",
                          params: { productId: item._id },
                        })
                      }
                    >
                      <View className="flex-1">
                        <Text
                          className="text-base font-lexend-semibold text-text-primary"
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text
                          className="text-sm text-text-muted mt-1"
                          numberOfLines={1}
                        >
                          {item.short_composition1 || "No composition info"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            ) : (
              <>
                <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
                  Featured Products
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {isFeaturedLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonPharmacyProductCard key={index} />
                    ))
                  ) : products.length === 0 ? (
                    <View className="h-28 justify-center items-center px-4">
                      <Text className="text-gray-400 text-sm font-lexend-medium">
                        No products found.
                      </Text>
                    </View>
                  ) : (
                    products.map((item) => (
                      <PharmacyProductCard
                        key={item._id}
                        item={item}
                        onPress={() =>
                          router.push({
                            pathname: "/pharmacy/product/[productId]",
                            params: { productId: item._id },
                          })
                        }
                      />
                    ))
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}
