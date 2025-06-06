import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import Carousel from "react-native-reanimated-carousel";
import STATIC from "@/utils/constants";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import PharmacyProductCard from "@/components/cards/PharmacyProductCard";
import { formatPrice, getDiscount } from "@/utils/format";
import useAxios from "@/hooks/useAxios";
import SkeletonPharmacyProductDetails from "@/components/skeletons/SkeletonPharmacyProductDetails";
import { Ionicons } from "@expo/vector-icons";
import AddToCartModalButton from "@/components/modals/AddToCartModalButton";
import { useAuthUser } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

const product = {
  id: 1,
  title: "Vitamin D-3 250gm",
  images: [
    STATIC.IMAGES.COMPONENTS.MEDICINE_2,
    STATIC.IMAGES.COMPONENTS.MEDICINE_1,
    STATIC.IMAGES.COMPONENTS.MEDICINE_3,
  ],
  rating: 4.8,
  price: 212,
  mrp: 235,
  manufacturer: "Loren Ipsum Pharmaceutical Industries LTD",
  description:
    "Vitamin D-3 helps support strong bones and immunity. It is a fat-soluble vitamin that your body uses to absorb calcium and phosphorus.",
  benefits: [
    "Supports strong bones",
    "Boosts immunity",
    "Helps calcium absorption",
  ],
  usage: "Take 1 tablet daily with meals or as directed by your physician.",
  precautions: [
    "Consult your doctor before use.",
    "Store in a cool dry place.",
    "Keep out of reach of children.",
  ],
  ingredients: ["Cholecalciferol (Vitamin D3)", "Gelatin", "Glycerin"],
  storage: "Store in a cool, dry place away from sunlight.",
};

const tabs = [
  "Description",
  "Key Benefits",
  "How to Use",
  "Precaution",
  "Ingredients",
];

export default function PharmacyProductDetailsScreen() {
  const { productId } = useLocalSearchParams();

  const { authUser } = useAuthUser();

  const { request: getProductDetails, loading: isLoading } = useAxios();
  const { request: getProductsbyManufacturer, loading: isFeaturedLoading } =
    useAxios();
  const { request: logUserEventMedicineClick, loading: isEventLoading } =
    useAxios();

  const [productDetails, setProductDetails] = useState({});
  const [productsWithManufaturer, setProductsWithManufacturer] = useState([]);

  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Text className="text-base font-lexend text-text-muted">
            {productDetails.description || product.description}
          </Text>
        );
      case 1:
        return (productDetails.benefits || product.benefits).map((item, i) => (
          <Text key={i} className="text-base font-lexend text-text-muted mb-1">
            • {item}
          </Text>
        ));
      case 2:
        return (
          <Text className="text-base font-lexend text-text-muted">
            {productDetails.usage || product.usage}
          </Text>
        );
      case 3:
        return (productDetails.precautions || product.precautions).map(
          (item, i) => (
            <Text
              key={i}
              className="text-base font-lexend text-text-muted mb-1"
            >
              • {item}
            </Text>
          )
        );
      case 4:
        return (productDetails.ingredients || product.ingredients).map(
          (item, i) => (
            <Text
              key={i}
              className="text-base font-lexend text-text-muted mb-1"
            >
              - {item}
            </Text>
          )
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { data, error } = await getProductDetails({
        url: `/user/get-medicine-by-id`,
        method: "GET",
        params: {
          medicineId: productId,
        },
      });
      if (error) {
        console.error("Error fetching product details:", error);
        return;
      }
      if (data?.data) {
        setProductDetails(data.data);
      }
    };

    const fetchProductsByManufacturer = async () => {
      const { data, error } = await getProductsbyManufacturer({
        url: `/user/medicines-by-manufacturer`,
        method: "GET",
        params: {
          medicineId: productId,
        },
      });

      if (error) {
        console.error("Error fetching products by manufacturer:", error);
        return;
      }
      if (data?.data?.medicines) {
        setProductsWithManufacturer(data.data.medicines);
      }
    };

    const logUserEventProduct = async () => {
      if (!authUser.isAuthenticated) return; // Only log if user is authenticated

      const { data, error } = await logUserEventMedicineClick({
        url: `/user/log-medicine-click`,
        method: "POST",
        authRequired: true,
        payload: {
          medicineId: productId,
        },
      });

      if (error) {
        console.error("Error logging product click event:", error);
      }
    };

    fetchProductDetails();
    fetchProductsByManufacturer();
    logUserEventProduct();
  }, [productId, authUser]);

  return (
    <AppLayout>
      <HeaderWithBack showCart showNotification showSearch />

      {isLoading ? (
        <>
          <SkeletonPharmacyProductDetails />
        </>
      ) : (
        <>
          {/* Carousel */}
          <View className="my-4">
            <Carousel
              loop
              width={width}
              height={240}
              autoPlay={false}
              data={
                productDetails.images?.length
                  ? productDetails.images
                  : product.images
              }
              scrollAnimationDuration={500}
              onSnapToItem={(index) => setActiveSlide(index)}
              renderItem={({ item }) => (
                <Image
                  source={item}
                  className="w-full h-60"
                  resizeMode="contain"
                />
              )}
            />
            <View className="flex-row justify-center mt-2">
              {productDetails.images?.length
                ? productDetails.images
                : product.images.map((_, i) => (
                    <View
                      key={i}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        i === activeSlide ? "bg-brand-primary" : "bg-text-muted"
                      }`}
                    />
                  ))}
            </View>
          </View>

          {/* Product Info */}
          <View className="bg-white p-5 rounded-xl my-4">
            <Text className="text-xl font-lexend-semibold text-gray-900 mb-1">
              {productDetails.name || product.title}
            </Text>
            <Text className="text-sm font-lexend text-gray-500">
              By {productDetails.manufacturer || product.manufacturer}
            </Text>
            <Text className="text-sm font-lexend text-gray-500">
              Origin: India
            </Text>
          </View>

          {/* Price Info */}
          <View className="bg-brand-background p-4 rounded-xl mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Text className="text-lg font-lexend-bold text-gray-900">
                  {formatPrice(productDetails.price || product.price)}
                </Text>
                <Text className="text-sm font-lexend text-gray-400 line-through ml-2">
                  MRP {formatPrice(productDetails.mrp || product.mrp)}
                </Text>
              </View>
              <View className="w-1/3">
                <AddToCartModalButton product={productDetails || product} />
              </View>
            </View>

            <Text className="text-sm font-lexend text-green-600">
              Save{" "}
              {formatPrice(
                getDiscount(
                  productDetails.mrp || product.mrp,
                  productDetails.price || product.price
                )
              )}
            </Text>

            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={20} color="yellow" className="mr-1" />
              <Text className="text-sm font-lexend text-gray-500">
                {productDetails.rating || product.rating}
              </Text>
            </View>
          </View>

          {/* Product Details Tabs */}
          <View className="bg-white p-4 rounded-xl mb-4">
            {/* Scrollable Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="border-b border-gray-200 mb-3"
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              {tabs.map((tab, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveTab(i)}
                  className={`mr-4 pb-2 ${
                    i === activeTab
                      ? "border-b-2 border-brand-primary"
                      : "border-transparent"
                  }`}
                >
                  <Text
                    className={`text-base font-lexend ${
                      i === activeTab ? "text-brand-primary" : "text-text-muted"
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tab Content (NOT scrollable) */}
            {renderTabContent()}
          </View>

          {/* Storage Info */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="text-md font-lexend-bold text-text-primary mb-1">
              Storage Instructions
            </Text>
            <Text className="text-sm font-lexend text-text-muted">
              {productDetails.storage || product.storage}
            </Text>
          </View>

          {/* Similar Products */}
          <View className="mt-6 mb-8">
            <Text className="text-lg font-lexend-bold text-text-primary mb-3">
              More by {productDetails.manufacturer}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {productsWithManufaturer.map((product) => (
                <PharmacyProductCard
                  key={product._id}
                  item={product}
                  onPress={() =>
                    router.push({
                      pathname: "/pharmacy/product/[productId]",
                      params: { productId: product._id },
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </AppLayout>
  );
}
