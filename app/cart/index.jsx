import React, { useEffect, useState } from "react";
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
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});

  const { authUser } = useAuthUser();
  const { showToast } = useAppToast();

  const { request: getAllCartItems } = useAxios();
  const { request: removeCartItem } = useAxios();
  const { request: updateCartItemQuantity } = useAxios();

  const fetchCartItems = async () => {
    const { data, error } = await getAllCartItems({
      url: "/user/get-cart",
      method: "GET",
      authRequired: true,
    });

    if (error) {
      console.log("Error fetching cart:", error);
    } else {
      const items = data.data.items || [];
      setCartItems(items);

      // Initialize localQuantities
      const qtyMap = {};
      items.forEach((item) => {
        qtyMap[item._id] = item.quantity;
      });
      setLocalQuantities(qtyMap);
    }
  };

  const handleRemove = async (itemId) => {
    const { data, error } = await removeCartItem({
      url: `/user/remove-item-from-cart`,
      method: "PUT",
      payload: { itemId, type: "medicine" },
      authRequired: true,
    });

    if (!error) {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      setLocalQuantities((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
      showToast("success", data.data.message || "Item removed from cart");
    }

    if (error) {
      console.log("Error removing item from cart:", error);
    }
  };

  useEffect(() => {
    if (authUser?.isAuthenticated && authUser?.token) {
      fetchCartItems();
    }
  }, [authUser]);

  // Debounce quantity updates
  useEffect(() => {
    const timers = Object.entries(localQuantities).map(([itemId, qty]) => {
      const item = cartItems.find((i) => i._id === itemId);
      if (!item || qty === item.quantity || qty < 1) return null;

      return setTimeout(() => {
        setCartItems((prev) =>
          prev.map((i) => (i._id === itemId ? { ...i, quantity: qty } : i))
        );

        updateCartItemQuantity({
          url: "/user/change-cart-product-quantity",
          method: "PUT",
          payload: { itemId, quantity: qty, type: "Medicine" },
          authRequired: true,
        });
      }, 600);
    });

    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [localQuantities]);

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          cartItems.map((item) => (
            <View
              key={item.item_id._id}
              className="bg-white p-4 my-1 rounded-xl flex-row items-start space-x-4"
            >
              <View className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden mr-4">
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
                  className="text-lg font-lexend-semibold text-gray-900"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  className="text-sm font-lexend text-gray-600"
                  numberOfLines={1}
                >
                  {item.item_id.short_composition1}
                </Text>
                <Text className="text-sm font-lexend text-gray-600">
                  {item.item_id.packSizeLabel}
                </Text>
                <Text className="text-base font-lexend text-text-muted mt-1">
                  ₹{item.price.toFixed(2)} x {localQuantities[item._id]} = ₹
                  {(item.price * (localQuantities[item._id] || 1)).toFixed(2)}
                </Text>

                <View className="flex-row justify-between items-center mt-3">
                  <TouchableOpacity
                    onPress={() => handleRemove(item._id)}
                    className="bg-brand-primary/90 p-2 rounded-lg flex-row items-center"
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                    <Text className="text-white text-xs font-lexend ml-1">
                      Remove
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row items-center bg-text-muted/20 rounded-lg px-2 py-1">
                    <TouchableOpacity
                      onPress={() =>
                        setLocalQuantities((prev) => ({
                          ...prev,
                          [item._id]: Math.max(1, (prev[item._id] || 1) - 1),
                        }))
                      }
                      className="p-1 rounded-full border border-text-muted"
                    >
                      <Ionicons name="remove" size={14} color="black" />
                    </TouchableOpacity>

                    <TextInput
                      value={String(localQuantities[item._id] || 1)}
                      onChangeText={(text) =>
                        setLocalQuantities((prev) => ({
                          ...prev,
                          [item._id]: text === "" ? 1 : parseInt(text) || 1,
                        }))
                      }
                      keyboardType="numeric"
                      inputMode="numeric"
                      maxLength={2}
                      className="w-10 text-center text-sm font-lexend text-text-muted"
                    />

                    <TouchableOpacity
                      onPress={() =>
                        setLocalQuantities((prev) => ({
                          ...prev,
                          [item._id]: (prev[item._id] || 1) + 1,
                        }))
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
            {/* Promo Code Toggle */}
            <TouchableOpacity
              className="bg-white p-5 rounded-xl flex-row items-center space-x-3 mt-4"
              onPress={() => setIsPromoApplied(!isPromoApplied)}
            >
              <Ionicons
                name={isPromoApplied ? "radio-button-on" : "radio-button-off"}
                size={24}
              />
              <Text className="text-base ml-4 font-lexend text-gray-800">
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
              onPress={() => setUrgentDelivery(!urgentDelivery)}
            >
              <Ionicons
                name={urgentDelivery ? "checkbox-outline" : "square-outline"}
                size={24}
              />
              <Text className="text-base ml-4 font-lexend text-gray-800">
                Mark as Urgent Delivery
              </Text>
            </TouchableOpacity>

            {/* Payment Summary */}
            <View className="bg-white border border-background-surface p-4 rounded-xl shadow-md mt-4">
              <Text className="text-lg font-lexend-semibold text-text-muted">
                Payment Details
              </Text>
              <View className="flex-1 gap-3 mt-4">
                <View className="flex-row justify-between">
                  <Text className="text-sm font-lexend text-gray-600">
                    Item Total
                  </Text>
                  <Text className="text-sm font-lexend text-gray-600">
                    ₹{calculateTotal().toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm font-lexend text-gray-600">
                    Promo Discount
                  </Text>
                  <Text className="text-sm font-lexend text-gray-600">
                    ₹{promoCode ? "5.00" : "0.00"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm font-lexend text-gray-600">
                    Urgent Delivery
                  </Text>
                  <Text className="text-sm font-lexend text-gray-600">
                    ₹{urgentDelivery ? "30.00" : "0.00"}
                  </Text>
                </View>
              </View>

              <View className="border-t border-gray-300 my-4" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-lexend text-gray-500">
                    Total Amount
                  </Text>
                  <Text className="text-xl font-lexend-bold text-gray-900 mt-1">
                    ₹
                    {(
                      calculateTotal() +
                      (promoCode ? -5.0 : 0) +
                      (urgentDelivery ? 30.0 : 0)
                    ).toFixed(2)}
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
