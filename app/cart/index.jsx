import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";
import { router } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";
import CartItemCard from "@/components/cards/CartItemCard";
import CartPromoCodeInput from "@/components/cards/CartPromoCodeInput";
import CartUrgentDeliveryToggle from "@/components/cards/CartUrgentDeliveryToggle";
import CartPaymentSummary from "@/components/cards/CartPaymentSummary";
import SkeletonCartScreen from "@/components/skeletons/SkeletonCartScreen";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);

  const { authUser } = useAuthUser();
  const { showToast } = useAppToast();
  const { request: getAllCartItems, loading: cartLoading } = useAxios();
  const { request: removeCartItem } = useAxios();
  const { request: updateCartItemQuantity } = useAxios();

  const timers = useRef({});

  useEffect(() => {
    if (!authUser?.isAuthenticated || !authUser.token) return;
    (async () => {
      const { data, error } = await getAllCartItems({
        url: "/user/get-cart",
        method: "GET",
        authRequired: true,
      });

      if (error) return console.error("Error fetching cart:", error);

      const items = data?.data?.items || [];
      setCartItems(items);
      setLocalQuantities(
        Object.fromEntries(
          items.map((item) => [item.item_id._id, item.quantity])
        )
      );
    })();
  }, [authUser]);

  const handleQuantityChange = (productId, newQty) => {
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));

    if (timers.current[productId]) clearTimeout(timers.current[productId]);

    timers.current[productId] = setTimeout(async () => {
      const item = cartItems.find((i) => i.item_id._id === productId);
      if (!item || item.quantity === newQty || newQty < 1) return;

      setCartItems((prev) =>
        prev.map((i) =>
          i.item_id._id === productId ? { ...i, quantity: newQty } : i
        )
      );

      await updateCartItemQuantity({
        url: "/user/change-cart-product-quantity",
        method: "PUT",
        payload: { itemId: productId, quantity: newQty, type: "Medicine" },
        authRequired: true,
      });
    }, 600);
  };

  const handleRemove = async (itemId) => {
    const { data, error } = await removeCartItem({
      url: `/user/remove-item-from-cart`,
      method: "PUT",
      payload: { itemId, type: "Medicine" },
      authRequired: true,
    });

    if (!error) {
      setCartItems((prev) =>
        prev.filter((item) => item.item_id._id !== itemId)
      );
      setLocalQuantities((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
      showToast("success", data?.data?.message || "Item removed from cart");
    } else {
      console.error("Error removing item:", error);
    }
  };

  const itemTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * (localQuantities[item.item_id._id] || 1),
        0
      ),
    [cartItems, localQuantities]
  );

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

  if (cartLoading) {
    return (
      <AppLayout>
        <HeaderWithBack
          title="My Cart"
          showBackButton
          clearStack
          backTo="/home"
        />
        <View className="flex-1 my-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCartScreen key={i} />
          ))}
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
          cartItems.map((item) => (
            <CartItemCard
              key={item.item_id._id}
              item={item}
              quantity={localQuantities[item.item_id._id] || 1}
              onRemove={() => handleRemove(item.item_id._id)}
              onQuantityChange={(qty) =>
                handleQuantityChange(item.item_id._id, qty)
              }
            />
          ))
        ) : (
          <Text className="text-center text-text-muted font-lexend mt-10">
            No items in your cart.
          </Text>
        )}

        {cartItems.length > 0 && (
          <>
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
        )}
      </ScrollView>
    </AppLayout>
  );
}
