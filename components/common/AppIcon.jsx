// components/ui/app-icon.js
import React from "react";
import * as LucideIcons from "lucide-react-native";
import { View } from "react-native";

/**
 * @param {{
 *  name: keyof typeof LucideIcons,
 *  size?: number,
 *  color?: string,
 *  className?: string,
 *  [key: string]: any
 * }} props
 */
export const AppIcon = ({
  name,
  size = 20,
  color = "black",
  className = "",
  ...props
}) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) return null;

  return (
    <View className={className}>
      <LucideIcon size={size} color={color} {...props} />
    </View>
  );
};
