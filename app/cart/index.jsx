import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";
import { router } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";
import CartItemCard from "@/components/cards/CartItemCard";
import CartPromoCodeInput from "@/components/cards/CartPromoCodeInput";
import CartUrgentDeliveryToggle from "@/components/cards/CartUrgentDeliveryToggle";
import CartPaymentSummary from "@/components/cards/CartPaymentSummary";
import SkeletonCartScreen from "@/components/skeletons/SkeletonCartScreen";
import { useCart } from "@/contexts/CartContext";
import CartAddressSelection from "@/components/cards/CartAddressSelection";
import CartPaymentOptions from "@/components/cards/CartPaymentOptions";
import useAxios from "@/hooks/useAxios";

export default function CartScreen() {
  const { authUser } = useAuthUser();
  const { showToast } = useAppToast();
  const {
    cartItems,
    localQuantities,
    updateQuantity,
    removeCartItem,
    itemTotal,
    reloadCart,
  } = useCart();

  const { request: initiateUserOrder, loading: initiateOrderLoading } =
    useAxios();

  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const promoDiscount = promoCode ? 5 : 0;
  const deliveryCharge = urgentDelivery ? 30 : 0;
  const totalAmount = itemTotal - promoDiscount + deliveryCharge;

  if (!authUser?.token || !authUser?.isAuthenticated) {
    return (
      <AppLayout>
        <HeaderWithBack
          title="My Cart"
          showBackButton
          clearStack
          backTo="/home"
        />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-lexend-medium text-center mb-4">
            No cart items found.
          </Text>
          <Text className="text-base text-text-muted mb-6 text-center">
            Login to view your cart items.
          </Text>
          <TouchableOpacity
            onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}
            className="bg-brand-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white text-base font-lexend-medium">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  const handlePlaceOrder = async (details) => {
    let initiateOrder = {
      item_ids: cartItems.map((item) => item.item_id._id),
      deliveryAddressId: selectedAddress,
      paymentMethod: selectedPayment,
    };

    console.log("Placing order with details:", initiateOrder);

    const { data, error } = await initiateUserOrder({
      url: "/user/create-order",
      method: "POST",
      payload: initiateOrder,
      authRequired: true,
    });

    console.log("Order placement response:", data);

    if (error) {
      console.error("Order placement failed:", error);
      showToast("error", error || "Failed to place order. Please try again.");
      return;
    }
    if (data?.status === 201 && data?.data) {
      showToast("success", data?.message || "Order placed successfully!");
      reloadCart();
      router.push(ROUTE_PATH.APP.ORDERS.INDEX);
    } else {
      showToast("error", data?.message || "Failed to place order.");
    }
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack
        title="My Cart"
        showBackButton
        clearStack
        backTo="/home"
      />
      <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false}>
        {cartItems.length > 0 ? (
          <>
            <View className="bg-white border border-background-surface p-4 rounded-xl">
              <Text className="text-lg font-lexend-semibold text-text-muted">
                {cartItems.length} {cartItems.length > 1 ? "items" : "item"} in
                your cart
              </Text>
            </View>
            <View className="border-b border-gray-200 my-2" />
            {cartItems.map((item) => (
              <CartItemCard
                key={item.item_id._id}
                item={item}
                quantity={localQuantities[item.item_id._id] || 1}
                onRemove={() => {
                  removeCartItem(item.item_id._id);
                  showToast("success", "Item removed from cart");
                }}
                onQuantityChange={(qty) =>
                  updateQuantity(item.item_id._id, qty)
                }
              />
            ))}

            {/* <CartPromoCodeInput
              isApplied={isPromoApplied}
              onToggle={() => setIsPromoApplied((v) => !v)}
              promoCode={promoCode}
              onChangeCode={setPromoCode}
            />
            <CartUrgentDeliveryToggle
              urgentDelivery={urgentDelivery}
              onToggle={() => setUrgentDelivery((v) => !v)}
            /> */}
            <CartPaymentSummary
              itemTotal={itemTotal}
              promoDiscount={promoDiscount}
              deliveryCharge={deliveryCharge}
              totalAmount={totalAmount}
              onCheckoutPress={() => {
                if (totalAmount <= 0) {
                  showToast("error", "Total amount must be greater than zero");
                  return;
                }
                router.push(`${ROUTE_PATH.APP.CHECKOUT.INDEX}?`);
              }}
            />

            <CartAddressSelection
              onSelectDeliveryAddress={(id) => {
                console.log("Selected address ID:", id);
                setSelectedAddress(id);
              }}
            />

            <CartPaymentOptions
              onSelectPaymentMethod={(method) => setSelectedPayment(method)}
              onPlaceOrder={handlePlaceOrder}
              isInitiatingOrder={initiateOrderLoading}
            />
          </>
        ) : (
          <View className="flex-1 justify-center items-center px-6 mt-28 ">
            <Text className="text-lg font-lexend-medium text-center mb-4">
              No items in your cart.
            </Text>
            <Text className="text-base text-text-muted mb-6 text-center">
              Browse our collection and add items to your cart.
            </Text>
            <TouchableOpacity
              onPress={() => router.push(ROUTE_PATH.APP.PHARMACY.INDEX)}
              className="bg-brand-primary px-6 py-3 rounded-xl"
            >
              <Text className="text-white text-base font-lexend-medium">
                Browse Medicines
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
}
