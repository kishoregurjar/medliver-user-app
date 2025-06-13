import { Dimensions, Pressable } from "react-native";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { AppIcon } from "@/components/common/AppIcon";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";

export const useAppToast = () => {
  const toast = useToast();
  const { width: screenWidth } = Dimensions.get("window");

  const containerStyle = {
    width: Math.min(screenWidth * 0.9, 443),
    marginHorizontal: "5%",
  };

  /**
   * Show a toast message with various types and customization options.
   *
   * @param {'success' | 'info' | 'error' | 'warning' | 'muted' | 'notification'} type - The type of the toast.
   * @param {string | {
   *   title?: string,
   *   subtitle?: string,
   *   description?: string,
   *   duration?: number,
   *   placement?: 'top' | 'bottom',
   *   avatar?: string,
   *   icon?: string,
   *   className?: string,
   *   dismissable?: boolean
   * }} config - Either a string (used as title) or a full config object.
   *
   * ## Examples:
   * showToast("success", "Saved successfully!");
   *
   * showToast("error", {
   *   title: "Something went wrong",
   *   description: "Please try again later",
   * });
   *
   * showToast("notification", {
   *   title: "Order Update",
   *   subtitle: "Your medicine is ready for pickup",
   *   avatar: "https://example.com/avatar.jpg",
   *   dismissable: true,
   * });
   */
  const showToast = (type, config) => {
    const id = Math.random();

    const toastConfig =
      typeof config === "string" ? { title: config } : config || {};

    const {
      title,
      subtitle,
      description,
      duration = 4000,
      placement = "bottom",
      avatar,
      icon,
      className = "",
      dismissable = true,
    } = toastConfig;

    const iconMap = {
      success: "CheckCircle2",
      info: "Info",
      error: "AlertCircle",
      warning: "AlertTriangle",
      muted: "Info",
    };

    const renderStandard = () => {
      const isCustom = !!className;

      return (
        <Toast
          nativeID={`toast-${id}`}
          className={
            isCustom
              ? `flex-row items-center gap-3 px-4 py-3 rounded-xl ${className}`
              : undefined
          }
          style={isCustom ? containerStyle : undefined}
          variant={"solid"}
          action={type}
        >
          <HStack space="md" alignItems="center">
            <AppIcon
              name={icon || iconMap[type]}
              size={20}
              color={isCustom ? "white" : 'white'}
            />
            <ToastTitle className={isCustom ? "text-white font-medium" : ""}>
              {title || type.charAt(0).toUpperCase() + type.slice(1)}
            </ToastTitle>
          </HStack>
        </Toast>
      );
    };

    const renderNotification = () => (
      <Toast
        nativeID={`toast-${id}`}
        className={`flex-row justify-between gap-4 px-4 py-3 rounded-xl ${
          className || "bg-background-900"
        }`}
        style={containerStyle}
      >
        <HStack space="md" alignItems="center">
          {avatar ? (
            <Avatar size="sm">
              <AvatarImage source={{ uri: avatar }} />
              <AvatarFallbackText>U</AvatarFallbackText>
            </Avatar>
          ) : icon ? (
            <AppIcon name={icon} size={20} color="#fff" />
          ) : null}

          <VStack space="xs">
            <ToastTitle className="text-white font-semibold text-base">
              {title || "Notification"}
            </ToastTitle>
            {(description || subtitle) && (
              <ToastDescription className="text-white text-sm">
                {description || subtitle}
              </ToastDescription>
            )}
          </VStack>
        </HStack>

        {dismissable && (
          <Pressable onPress={() => toast.close(id)}>
            <AppIcon name="X" size={18} color="#fff" />
          </Pressable>
        )}
      </Toast>
    );

    toast.show({
      id,
      duration,
      placement,
      avoidKeyboard: true,
      swipeEnabled: true,
      render: type === "notification" ? renderNotification : renderStandard,
    });
  };

  return { showToast };
};
