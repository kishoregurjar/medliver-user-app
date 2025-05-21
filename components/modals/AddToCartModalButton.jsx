import React, { useState } from "react";
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
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";

export default function AddToCartModalButton({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const {
    request: addToCart,
    loading: isLoading,
    error: hasError,
  } = useAxios();
  const { authUser } = useAuthUser();
  const { showToast } = useAppToast();

  const onClose = () => {
    setIsOpen(false);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    const { data, error } = await addToCart({
      method: "POST",
      url: "/user/add-to-cart",
      payload: {
        productId: product._id,
        quantity,
        type: "Medicine",
      },
      authRequired: true,
    });
    if (error) {
      console.error("Error adding to cart:", error);
      showToast("error", "Failed to add item to cart");
    } else {      
      showToast("success", data.message || "Item added to cart");
      onClose();
    }
  };

  const increaseQty = () => {
    setQuantity((prev) => Math.min(prev + 1, 20));
  };

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <Button
        onPress={
          authUser?.token
            ? () => setIsOpen(true)
            : () => showToast("warning", "Login to add items to cart")
        }
        className="bg-brand-primary rounded-lg px-5 py-3"
      >
        <ButtonText className="text-white font-lexend-semibold text-sm">
          Add to Cart
        </ButtonText>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalBackdrop />
        <ModalContent className="bg-white text-text-primary rounded-2xl p-4">
          <ModalHeader className="flex-row items-center justify-between">
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
            <VStack space="md" className="pt-2">
              <Text className="text-base font-lexend text-typography-500">
                Choose Quantity
              </Text>
              <View className="flex-row justify-between items-center space-x-3 mt-2">
                {/* Decrease Button */}
                <Pressable
                  onPress={decreaseQty}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 border border-gray-300 rounded-md justify-center items-center ${
                    quantity <= 1 ? "opacity-50" : ""
                  }`}
                >
                  {/* <MinusIcon className="text-typography-900 w-4 h-4" /> */}
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                </Pressable>

                {/* Quantity Input */}
                <TextInput
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
                  className="w-32 h-10 text-center border border-gray-300 rounded-md px-2 py-1 text-base text-typography-900 font-lexend-semibold"
                  placeholder="1"
                  placeholderTextColor="#A0A0A0"
                />

                {/* Increase Button */}
                <Pressable
                  onPress={increaseQty}
                  disabled={quantity >= 20}
                  className={`w-10 h-10 border border-gray-300 rounded-md justify-center items-center ${
                    quantity >= 20 ? "opacity-50" : ""
                  }`}
                >
                  {/* <PlusIcon className="text-typography-900 w-4 h-4" /> */}
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </Pressable>
              </View>
            </VStack>
          </ModalBody>

          <ModalFooter className="pt-4">
            <HStack space="sm" justifyContent="flex-end">
              <Button variant="outline" action="secondary" onPress={onClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button onPress={handleAddToCart} className="bg-brand-primary">
                <ButtonText className="text-white font-lexend-semibold">
                  Add {quantity}
                </ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
