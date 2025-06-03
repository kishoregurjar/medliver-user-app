import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { clsx } from "clsx";

export default function CTAButton({
  label,
  icon,
  iconPosition = "left",
  loading = false,
  loaderText = "Processing...",
  loaderColor,
  disabled = false,
  onPress,
  className,
  textClassName,
  loaderClassName,
  size = "md", // 'sm' | 'md' | 'lg'
  iconOnly = false,
  variant = "primary", // 'primary' | 'secondary' | 'default' | 'custom' | 'transparent'
  mode = "solid", // 'solid' | 'outlined' | 'ghost' | 'link'
  shape = "rounded", // 'square' | 'rounded' | 'pill'
}) {
  const isDisabled = loading || disabled;

  const sizeStyles = {
    sm: { button: "py-2 px-3", text: "text-sm", loader: "gap-1" },
    md: { button: "py-3 px-4", text: "text-base", loader: "gap-2" },
    lg: { button: "py-4 px-5", text: "text-lg", loader: "gap-3" },
  };

  const variantStyles = {
    primary: { base: "bg-brand-primary border-brand-primary text-white" },
    secondary: { base: "bg-brand-secondary border-brand-secondary text-black" },
    default: { base: "bg-gray-400 border-gray-400 text-black" },
    transparent: { base: "bg-transparent border-transparent text-black" },
    custom: { base: "" }, // will rely on passed `className`
  };

  const modeStyles = {
    solid: "",
    outlined: "bg-transparent border",
    ghost: "bg-transparent border-transparent",
    link: "bg-transparent border-transparent",
  };

  const shapeStyles = {
    square: "rounded-none",
    rounded: "rounded-xl",
    pill: "rounded-full",
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentMode = modeStyles[mode] || modeStyles.solid;
  const currentShape = shapeStyles[shape] || shapeStyles.rounded;

  const textColorFromVariant =
    variant !== "custom"
      ? currentVariant.base.match(/text-[^\s]+/)?.[0] || "text-white"
      : "text-white"; // fallback if not passed in className

  const spinnerColor =
    loaderColor || (textColorFromVariant.includes("black") ? "#000" : "#fff");

  const renderContent = () => {
    if (loading) {
      return (
        <View
          className={
            loaderClassName ||
            `flex-row items-center justify-center ${currentSize.loader}`
          }
        >
          <ActivityIndicator size="small" color={spinnerColor} />
          {!iconOnly && (
            <Text
              className={
                textClassName ||
                `${textColorFromVariant} font-lexend-medium ${currentSize.text}`
              }
            >
              {loaderText}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View className="flex-row items-center justify-center space-x-2">
        {iconPosition === "left" && icon}
        {!iconOnly && (
          <Text
            className={
              textClassName ||
              `${textColorFromVariant} font-lexend-semibold ${currentSize.text}`
            }
          >
            {label}
          </Text>
        )}
        {iconPosition === "right" && icon}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={clsx(
        "items-center justify-center",
        currentSize.button,
        currentShape,
        currentMode,
        variant !== "custom" && currentVariant.base,
        variant !== "custom" && variant !== "transparent" && "shadow-md",
        mode !== "ghost" &&
          mode !== "link" &&
          variant !== "transparent" &&
          variant !== "custom" &&
          "border",
        isDisabled && "opacity-60",
        className
      )}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
