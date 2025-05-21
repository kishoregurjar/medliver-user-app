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

  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);

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

  return (
    <AppLayout>
      <HeaderWithBack
        title="My Cart"
        showBackButton
        clearStack
        backTo="/home"
      />
      <ScrollView className="flex-1 py-4">
        {cartItems.length > 0 ? (
          <>
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

            <CartPromoCodeInput
              isApplied={isPromoApplied}
              onToggle={() => setIsPromoApplied((v) => !v)}
              promoCode={promoCode}
              onChangeCode={setPromoCode}
            />
            <CartUrgentDeliveryToggle
              urgentDelivery={urgentDelivery}
              onToggle={() => setUrgentDelivery((v) => !v)}
            />
            <CartPaymentSummary
              itemTotal={itemTotal}
              promoDiscount={promoDiscount}
              deliveryCharge={deliveryCharge}
              totalAmount={totalAmount}
              onCheckoutPress={() => {}}
            />
          </>
        ) : (
          <Text className="text-center text-text-muted font-lexend mt-10">
            No items in your cart.
          </Text>
        )}
      </ScrollView>
    </AppLayout>
  );
}
