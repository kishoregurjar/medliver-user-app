import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";
import { router } from "expo-router";
import ROUTE_PATH from "@/routes/route.constants";

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
        Object.fromEntries(items.map((item) => [item._id, item.quantity]))
      );
    })();
  }, [authUser]);

  const handleQuantityChange = (itemId, newQty) => {
    setLocalQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    if (timers.current[itemId]) clearTimeout(timers.current[itemId]);

    timers.current[itemId] = setTimeout(async () => {
      const item = cartItems.find((i) => i._id === itemId);
      if (!item || item.quantity === newQty || newQty < 1) return;

      setCartItems((prev) =>
        prev.map((i) => (i._id === itemId ? { ...i, quantity: newQty } : i))
      );

      await updateCartItemQuantity({
        url: "/user/change-cart-product-quantity",
        method: "PUT",
        payload: { itemId, quantity: newQty, type: "Medicine" },
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
        (sum, item) => sum + item.price * (localQuantities[item._id] || 1),
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
            <View
              key={i}
              className="flex-row p-4 my-1 rounded-xl bg-white space-x-4 animate-pulse"
            >
              <View className="w-1/4 h-24 bg-gray-200 rounded-md mr-4" />
              <View className="flex-1 justify-between py-1">
                <View className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <View className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                <View className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                <View className="h-4 bg-gray-200 rounded w-2/3" />
              </View>
            </View>
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
            <View
              key={item.item_id._id}
              className="bg-white p-4 my-1 rounded-xl flex-row items-start space-x-4"
            >
              <View className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  source={{
                    uri:
                      item.item_id.image || "https://via.placeholder.com/100",
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <Text
                  className="text-lg font-lexend-semibold"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.item_id.short_composition1}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.item_id.packSizeLabel}
                </Text>
                <Text className="text-base text-text-muted mt-1">
                  ₹{item.price.toFixed(2)} x {localQuantities[item._id]} = ₹
                  {(item.price * localQuantities[item._id]).toFixed(2)}
                </Text>

                <View className="flex-row justify-between items-center mt-3">
                  <TouchableOpacity
                    onPress={() => handleRemove(item.item_id._id)}
                    className="bg-brand-primary/90 p-2 rounded-lg flex-row items-center"
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                    <Text className="text-white text-xs ml-1">Remove</Text>
                  </TouchableOpacity>

                  <View className="flex-row items-center bg-text-muted/20 rounded-lg px-2 py-1">
                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityChange(
                          item._id,
                          Math.max(1, localQuantities[item._id] - 1)
                        )
                      }
                      className="p-1 rounded-full border border-text-muted"
                    >
                      <Ionicons name="remove" size={14} color="black" />
                    </TouchableOpacity>

                    <TextInput
                      value={String(localQuantities[item._id] || 1)}
                      onChangeText={(text) =>
                        handleQuantityChange(item._id, parseInt(text) || 1)
                      }
                      keyboardType="numeric"
                      maxLength={2}
                      className="w-10 text-center text-sm text-text-muted"
                    />

                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityChange(
                          item._id,
                          localQuantities[item._id] + 1
                        )
                      }
                      className="p-1 rounded-full border border-text-muted"
                    >
                      <Ionicons name="add" size={14} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-center text-text-muted font-lexend mt-10">
            No items in your cart.
          </Text>
        )}

        {cartItems.length > 0 && (
          <>
            {/* Promo Code */}
            <TouchableOpacity
              className="bg-white p-5 rounded-xl flex-row items-center space-x-3 mt-4"
              onPress={() => setIsPromoApplied((v) => !v)}
            >
              <Ionicons
                name={isPromoApplied ? "radio-button-on" : "radio-button-off"}
                size={24}
              />
              <Text className="text-base font-lexend text-gray-800">
                Apply Promo Code
              </Text>
            </TouchableOpacity>

            {isPromoApplied && (
              <TextInput
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter Promo Code"
                className="bg-white p-5 rounded-xl font-lexend shadow-md mt-2"
              />
            )}

            {/* Urgent Delivery */}
            <TouchableOpacity
              className="flex-row bg-white p-5 rounded-xl items-center space-x-3 mt-4"
              onPress={() => setUrgentDelivery((v) => !v)}
            >
              <Ionicons
                name={urgentDelivery ? "checkbox-outline" : "square-outline"}
                size={24}
              />
              <Text className="text-base font-lexend text-gray-800">
                Mark as Urgent Delivery
              </Text>
            </TouchableOpacity>

            {/* Payment Summary */}
            <View className="bg-white border border-background-surface p-4 rounded-xl shadow-md mt-4">
              <Text className="text-lg font-lexend-semibold text-text-muted">
                Payment Details
              </Text>
              <View className="gap-3 mt-4">
                <SummaryRow label="Item Total" value={itemTotal} />
                <SummaryRow label="Promo Discount" value={-promoDiscount} />
                <SummaryRow label="Urgent Delivery" value={deliveryCharge} />
              </View>

              <View className="border-t border-gray-300 my-4" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-lexend text-gray-500">
                    Total Amount
                  </Text>
                  <Text className="text-xl font-lexend-bold text-gray-900 mt-1">
                    ₹{totalAmount.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity className="bg-brand-primary/90 px-6 py-3 rounded-xl">
                  <Text className="text-white text-base font-lexend-semibold">
                    Proceed to Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </AppLayout>
  );
}

const SummaryRow = ({ label, value }) => (
  <View className="flex-row justify-between">
    <Text className="text-sm font-lexend text-gray-600">{label}</Text>
    <Text className="text-sm font-lexend text-gray-600">
      ₹{value >= 0 ? value.toFixed(2) : `-${Math.abs(value).toFixed(2)}`}
    </Text>
  </View>
);
