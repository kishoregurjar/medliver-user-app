import { Dimensions } from "react-native"; // Import Dimensions for screen width
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { AppIcon } from "@/components/common/AppIcon";

/**
 * @typedef {'error' | 'notification' | 'update' | 'success'} ToastType
 *
 * @typedef {{
 *   fallback: string,
 *   uri: string
 * }} ToastAvatar
 *
 * @typedef {{
 *   title?: string,
 *   description?: string,
 *   avatar?: ToastAvatar,
 *   duration?: number
 * }} ToastConfig
 */

/**
 * Custom reusable toast hook with autocomplete and shortcut-style calling.
 */
export const useAppToast = () => {
  const toast = useToast();

  const { width: screenWidth } = Dimensions.get("window"); // Get screen width

  /**
   * Show toast easily with type and optional config.
   * @param {ToastType} type
   * @param {string | ToastConfig} messageOrConfig
   */
  const showToast = (type, messageOrConfig) => {
    const id = Math.random();

    console.log("Show toast:", type, messageOrConfig);

    const config =
      typeof messageOrConfig === "string"
        ? { title: messageOrConfig }
        : messageOrConfig || {};

    const { title, description, avatar, duration } = config;

    // Set the width to a percentage of the screen width with padding
    const toastWidth = screenWidth * 0.9; // Adjust 0.9 to your desired width percentage
    const maxWidth = 443; // You can tweak this to a specific value to limit max width

    const renderers = {
      success: () => (
        <Toast
          nativeID={`toast-${id}`}
          className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
          style={{
            width: Math.min(toastWidth, maxWidth),
            marginHorizontal: "5%",
          }} // Centering and limiting width
        >
          <AppIcon name="CheckCircle2" size={24} color="#10B981" />
          <Divider orientation="vertical" className="h-[30px] bg-outline-200" />
          <ToastTitle size="sm">{title || "Success"}</ToastTitle>
        </Toast>
      ),

      error: () => (
        <Toast
          action="error"
          variant="outline"
          nativeID={`toast-${id}`}
          className="p-4 gap-6 border-error-500 w-full shadow-hard-5 flex-row justify-between"
          style={{
            width: Math.min(toastWidth, maxWidth),
            marginHorizontal: "5%",
          }} // Centering and limiting width
        >
          <HStack space="md">
            <AppIcon
              name="HelpCircle"
              size={20}
              color="#EF4444"
              className="mt-0.5"
            />
            <VStack space="xs">
              <ToastTitle className="font-semibold text-error-500">
                {title || "Error!"}
              </ToastTitle>
              <ToastDescription size="sm">
                {description || "Something went wrong."}
              </ToastDescription>
            </VStack>
          </HStack>
          <HStack className="min-[450px]:gap-3 gap-1">
            <Button variant="link" size="sm" className="px-3.5 self-center">
              <ButtonText>Retry</ButtonText>
            </Button>
            <Pressable onPress={() => toast.close(id)}>
              <AppIcon name="X" size={20} color="#EF4444" />
            </Pressable>
          </HStack>
        </Toast>
      ),

      update: () => (
        <Toast
          nativeID={`toast-${id}`}
          className="p-4 gap-4 w-full max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
          style={{
            width: Math.min(toastWidth, maxWidth),
            marginHorizontal: "5%",
          }} // Centering and limiting width
        >
          <Box className="h-11 w-11 items-center justify-center hidden min-[400px]:flex bg-background-50">
            <AppIcon name="RefreshCcw" size={24} color="#1F2937" />
          </Box>
          <VStack space="xl">
            <VStack space="xs">
              <HStack className="justify-between">
                <ToastTitle className="text-typography-900 font-semibold">
                  {title || "Update available"}
                </ToastTitle>
                <Pressable onPress={() => toast.close(id)}>
                  <AppIcon name="X" size={20} color="#EF4444" />
                </Pressable>
              </HStack>
              <ToastDescription className="text-typography-700">
                {description ||
                  "A new software version is available for download."}
              </ToastDescription>
            </VStack>
            <ButtonGroup className="gap-3 flex-row">
              <Button
                action="secondary"
                variant="outline"
                size="sm"
                className="flex-grow"
              >
                <ButtonText>Not now</ButtonText>
              </Button>
              <Button size="sm" className="flex-grow">
                <ButtonText>Update</ButtonText>
              </Button>
            </ButtonGroup>
          </VStack>
        </Toast>
      ),

      notification: () => (
        <Toast
          nativeID={`toast-${id}`}
          className="p-4 gap-3 w-full sm:min-w-[386px] max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
          style={{
            width: Math.min(toastWidth, maxWidth),
            marginHorizontal: "5%",
          }} // Centering and limiting width
        >
          <Avatar>
            <AvatarFallbackText>{avatar?.fallback}</AvatarFallbackText>
            <AvatarImage source={{ uri: avatar?.uri }} />
          </Avatar>
          <VStack className="web:flex-1">
            <HStack className="justify-between">
              <Heading size="sm" className="text-typography-950 font-semibold">
                {title || "User"}
              </Heading>
              <Text size="sm" className="text-typography-500">
                2m ago
              </Text>
            </HStack>
            <Text size="sm" className="text-typography-500">
              {description || "Commented on your photo"}
            </Text>
          </VStack>
        </Toast>
      ),
    };

    toast.show({
      id,
      placement: "bottom",
      duration: duration || 3000,
      render: () => renderers[type](),
      avoidKeyboard: true,
    });
  };

  return {
    showToast,
  };
};
