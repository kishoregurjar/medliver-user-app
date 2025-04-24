import React, { ReactNode, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import clsx from "clsx";

type AnimatedActionButtonProps = {
  text: string;
  onPress: () => void;
  icon?: ReactNode;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  rippleColor?: string;
  maxWidth?: number;
  scaleTo?: number;
  fontSize?: number;
};

const AnimatedActionButton = ({
  text,
  onPress,
  icon,
  className = "flex-row items-center justify-center bg-app-color-red px-6 py-3 rounded-2xl",
  textClassName = "text-white font-semibold mr-2",
  style = {},
  disabled = false,
  loading = false,
  rippleColor = "#c53030",
  maxWidth = 400,
  scaleTo = 0.95,
  fontSize,
}: AnimatedActionButtonProps) => {
  const { width } = useWindowDimensions();
  const scaleAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePressIn = () => {
    scaleAnim.value = withTiming(scaleTo, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleAnim.value = withTiming(1, { duration: 100 });
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: "100%",
          maxWidth,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: rippleColor }}
        className={clsx(className, disabled && "opacity-50")}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View className="flex-row items-center justify-center">
            <Text
              className={textClassName}
              style={{
                fontSize: fontSize || Math.min(width * 0.045, 18),
              }}
            >
              {text}
            </Text>
            {icon && icon}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedActionButton;
