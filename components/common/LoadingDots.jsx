import { Text, View } from "react-native";
import { MotiView } from "moti";

export default function LoadingDots({
  title = null,
  subtitle = null,
  numberOfDots = 3,
  dotSize = 15,
  dotColor = "#B31F24",
  bounceHeight = 10,
  duration = 500,
  containerStyle = "",
  dotContainerStyle = "",
}) {
  return (
    <View
      accessibilityRole="status"
      accessibilityLabel="Loading indicator"
      className={`flex-1 w-full h-full justify-center items-center px-6 ${containerStyle}`}
    >
      {/* Animated dots */}
      <View className={`flex flex-row gap-2 mb-4 ${dotContainerStyle}`}>
        {Array.from({ length: numberOfDots }).map((_, index) => (
          <MotiView
            from={{ opacity: 0.2, translateY: 0 }}
            animate={{ opacity: 1, translateY: -bounceHeight }}
            transition={{
              loop: true,
              delay: index * 100,
              duration,
              type: "timing",
            }}
            key={index}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dotColor,
            }}
          />
        ))}
      </View>

      {/* Animated Title */}
      {title && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
        >
          <Text className="text-lg font-lexend-medium text-center text-text-primary mb-2">
            {title}
          </Text>
        </MotiView>
      )}

      {/* Animated Subtitle */}
      {subtitle && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 100 }}
        >
          <Text className="text-base font-lexend-regular text-center text-text-muted">
            {subtitle}
          </Text>
        </MotiView>
      )}
    </View>
  );
}
