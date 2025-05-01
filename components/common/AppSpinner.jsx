import { ActivityIndicator, View } from "react-native";

export const AppSpinner = ({
  size = "large",
  color = "#E55150",
  className = "",
  overlay = false,
  style,
}) => {
  const combinedClassName = [
    overlay
      ? "absolute inset-0 items-center justify-center z-50 bg-black/10"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View className={combinedClassName} style={style}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
