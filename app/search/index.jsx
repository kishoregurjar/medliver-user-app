import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import SkeletonPharmacyProductCard from "@/components/skeletons/SkeletonPharmacyProductCard";
import FileUploader from "@/components/common/FileUploader";
import CTAButton from "@/components/common/CTAButton";
import ROUTE_PATH from "@/routes/route.constants";
import SelectAddressModal from "@/components/modals/SelectAddressModal";

export default function SearchMedicineScreen() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // NEW
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const router = useRouter();

  const { request: searchMedicines, loading: isLoading } = useAxios();
  const { request: fetchFeaturedProducts, loading: isFeaturedLoading } =
    useAxios();

  const handleSearch = async (searchTerm) => {
    if (!searchTerm?.trim()) {
      setIsSearching(false); // back to featured
      // Optional: reassign featured products if needed again
      return;
    }

    setIsSearching(true);

    const { data, error } = await searchMedicines({
      method: "GET",
      url: `/user/search-medicine?query=${searchTerm}&page=1`,
    });

    if (!error && data?.data?.data) {
      setProducts(data.data.data);
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await fetchFeaturedProducts({
        method: "GET",
        url: "/user/get-all-feature-product?page=1",
      });

      if (!error && data?.status === 200) {
        setProducts(data.data.featuredProducts);
        setIsSearching(false); // ensure flag is reset
      }
    };

    fetchFeatured();
  }, []);

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Search Medicines" />

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
          {query.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setQuery("");
                setIsSearching(false); // back to featured
              }}
            >
              <Ionicons name="close-circle" size={24} color="grey" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Explore Section */}
        {!isSearching && (
          <View className="mb-6">
            <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
              Explore Medilivurr
            </Text>
            <View className="flex-row justify-evenly items-center my-2">
              <CTAButton
                label="Pharmacy"
                icon={
                  <Ionicons
                    name="medkit"
                    size={16}
                    color="#fff"
                    className="mr-2"
                  />
                }
                shape="pill"
                onPress={() => router.push(ROUTE_PATH.APP.PHARMACY.INDEX)}
              />
              <CTAButton
                label="Pathology"
                icon={
                  <Ionicons
                    name="flask"
                    size={16}
                    color="#fff"
                    className="mr-2"
                  />
                }
                shape="pill"
                onPress={() => router.push(ROUTE_PATH.APP.PATHOLOGY.INDEX)}
              />
            </View>
          </View>
        )}

        {/* Have a Prescription */}
        {!isSearching && (
          <>
            <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
              Have a Doctor's Prescription?
            </Text>
            <Text className="text-sm font-lexend-medium text-gray-600 mb-3">
              Upload your prescription and get your medicines delivered to your
              doorstep.
            </Text>
            <View className="p-2">
              {showAddressModal && (
                <SelectAddressModal
                  onSelect={(address) => {
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                    handleUpload(selectedFiles, address); // 🟢 Actual upload
                  }}
                />
              )}

              <FileUploader
                url="/user/upload-prescription"
                allowedTypes={["image/png", "image/jpeg", "application/pdf"]}
                maxFileSize={5}
                maxFiles={5}
                shouldEnableUploadButton={(files) => files.length > 0}
                onFilesSelected={(files) => {
                  setPendingFiles(files); // store selected files
                  setShowAddressModal(true); // open modal
                }}
                onSuccess={(data) => {
                  if (__DEV__) console.log("File Upload Success:", data);
                }}
                onError={(err) => {
                  if (__DEV__) console.log("File Upload Error:", err);
                  Alert.alert("Warning", err.message, [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Add Address",
                      onPress: () =>
                        router.push(ROUTE_PATH.APP.ACCOUNT.ADD_ADDRESS),
                    },
                  ]);
                  // ToastAndroid.show(err.message, 3000);
                }}
                extraPayload={{
                  deliveryAddressId: selectedAddress,
                }}
              />
            </View>
          </>
        )}

        {/* Products Section */}
        <View className="mb-6">
          {!isSearching && (
            <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
              Featured Products
            </Text>
          )}

          {isLoading || isFeaturedLoading ? (
            <ScrollView
              horizontal={isSearching ? false : true}
              showsHorizontalScrollIndicator={false}
            >
              {Array.from({ length: isSearching ? 10 : 3 }).map((_, index) =>
                isSearching ? (
                  <View
                    key={index}
                    className="animate-pulse flex-row items-center border-b border-background-soft p-2 mb-4"
                  >
                    <View className="flex-1">
                      <View className="h-4 w-full bg-gray-300 rounded mb-2"></View>
                      <View className="h-4 w-3/4 bg-gray-300 rounded"></View>
                    </View>
                  </View>
                ) : (
                  <SkeletonPharmacyProductCard key={index} />
                )
              )}
            </ScrollView>
          ) : products.length === 0 ? (
            <View className="h-28 justify-center items-center px-4">
              <Text className="text-gray-400 text-sm font-lexend-medium">
                {isSearching
                  ? `No products found for "${query}".`
                  : "No products found."}
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal={!isSearching}
              showsHorizontalScrollIndicator={false}
            >
              {products.map((item) =>
                isSearching ? (
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
                ) : (
                  <PharmacyProductCard
                    key={item._id}
                    item={item}
                    onPress={() =>
                      router.push({
                        pathname: "/pharmacy/product/[productId]",
                        params: { productId: item.product._id },
                      })
                    }
                  />
                )
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
}
