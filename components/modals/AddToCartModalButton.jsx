import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";
import { useCart } from "@/contexts/CartContext";

export default function AddToCartModalButton({ product, variant = "button" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const quantityInputRef = useRef(null);

  const { authUser } = useAuthUser();
  const { showToast } = useAppToast();
  const {
    addToCartItem,
    getLastQuantityForProduct,
    setLastQuantityForProduct,
  } = useCart();

  const { request: addToCart, loading: isLoading } = useAxios();

  // Load last selected quantity from cart context
  useEffect(() => {
    if (isOpen) {
      const lastQty = getLastQuantityForProduct(product._id);
      setQuantity(lastQty || 1);

      // Autofocus quantity input after slight delay
      setTimeout(() => {
        quantityInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleAddToCart = async () => {
    if (!authUser?.isAuthenticated) return;
    const { data, error } = await addToCartItem(product._id, quantity);
    if (error) {
      showToast("error", error || "Failed to add item to cart");
    } else {
      showToast("success", data?.message || "Item added to cart");
      setLastQuantityForProduct(product._id, quantity);
      onClose();
    }
  };

  const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, 20));
  const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const openModal = () => {
    if (authUser?.isAuthenticated) {
      setIsOpen(true);
    } else {
      showToast("warning", "Login to add items to cart");
    }
  };

  return (
    <>
      {variant === "button" ? (
        <TouchableOpacity
          onPress={openModal}
          className="flex-row w-full items-center justify-center bg-brand-primary rounded-lg py-2"
          accessibilityLabel="Add to cart button"
          activeOpacity={0.7}
        >
          <Text className="text-text-inverse text-sm font-lexend-semibold ml-1">
            Add to Cart
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={openModal}
          className="flex-row items-center justify-center rounded-lg py-1"
          accessibilityLabel="Add to cart button"
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color="#E2AD5F" />
          <Text className="text-brand-secondary text-sm font-lexend-semibold ml-1">
            Add to Cart
          </Text>
        </TouchableOpacity>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalBackdrop />
        <ModalContent className="bg-white text-text-primary rounded-2xl px-4 pt-4 pb-6">
          <ModalHeader className="flex-row items-center justify-between pb-2">
            <Text className="text-lg font-lexend-bold text-typography-950">
              Add to Cart
            </Text>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400"
              />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <VStack space="lg">
              {/* Product Info Card */}
              <View className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex-row">
                {product.images?.[0] && (
                  <Image
                    source={{ uri: product.images[0] }}
                    className="w-16 h-16 rounded-md mr-3"
                    resizeMode="contain"
                    accessibilityLabel={`${product.name} image`}
                  />
                )}
                <View className="flex-1">
                  <Text className="text-typography-900 font-lexend-semibold text-base">
                    {product.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {product.manufacturer}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Pack: {product.packSizeLabel}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Composition: {product.short_composition1}{" "}
                    {product.short_composition2}
                  </Text>
                  <HStack space="sm" className="mt-2 items-center">
                    <Text className="text-brand-primary font-lexend-bold text-lg">
                      ₹{product.price}
                    </Text>
                    {product.isPrescriptionRequired && (
                      <Text className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-lexend-semibold">
                        Rx Required
                      </Text>
                    )}
                  </HStack>
                </View>
              </View>

              {/* Quantity Selector */}
              <VStack space="xs">
                <Text className="text-base font-lexend text-typography-500">
                  Choose Quantity
                </Text>
                <View className="flex-row justify-between items-center space-x-3">
                  <Pressable
                    onPress={decreaseQty}
                    disabled={quantity <= 1}
                    accessibilityLabel="Decrease quantity"
                    className={`w-10 h-10 border border-gray-300 rounded-md justify-center items-center ${
                      quantity <= 1 ? "opacity-50" : ""
                    }`}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color="black"
                    />
                  </Pressable>

                  <TextInput
                    ref={quantityInputRef}
                    value={quantity.toString()}
                    onChangeText={(val) => {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) {
                        setQuantity(Math.max(1, Math.min(num, 20)));
                      } else if (val === "") {
                        setQuantity("");
                      }
                    }}
                    keyboardType="numeric"
                    inputMode="numeric"
                    maxLength={2}
                    accessibilityLabel="Quantity input"
                    className="w-24 h-10 text-center border border-gray-300 rounded-md px-2 py-1 text-base text-typography-900 font-lexend-semibold"
                    placeholder="1"
                    placeholderTextColor="#A0A0A0"
                  />

                  <Pressable
                    onPress={increaseQty}
                    disabled={quantity >= 20}
                    accessibilityLabel="Increase quantity"
                    className={`w-10 h-10 border border-gray-300 rounded-md justify-center items-center ${
                      quantity >= 20 ? "opacity-50" : ""
                    }`}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color="black"
                    />
                  </Pressable>
                </View>
              </VStack>

              {/* Total Price */}
              <View className="pt-1">
                <Text className="text-right text-base text-typography-700 font-lexend">
                  Total: ₹{(product.price * quantity).toFixed(2)}
                </Text>
              </View>
            </VStack>
          </ModalBody>

          <ModalFooter className="pt-4">
            <HStack space="sm" justifyContent="flex-end">
              <Button variant="outline" action="secondary" onPress={onClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleAddToCart}
                className="bg-brand-primary"
                disabled={isLoading}
              >
                <ButtonText className="text-white font-lexend-semibold">
                  {isLoading ? "Adding..." : `Add ${quantity}`}
                </ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
