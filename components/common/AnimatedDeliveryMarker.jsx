import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

export default function AnimatedDeliveryMarker({ location }) {
  const latitude = useSharedValue(location.latitude);
  const longitude = useSharedValue(location.longitude);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      latitude.value = withTiming(location.latitude, { duration: 800 });
      longitude.value = withTiming(location.longitude, { duration: 800 });
    }
  }, [location]);

  const animatedProps = useAnimatedProps(() => {
    return {
      coordinate: {
        latitude: latitude.value,
        longitude: longitude.value,
      },
    };
  });

  return (
    <AnimatedMarker animatedProps={animatedProps} anchor={{ x: 0.5, y: 0.5 }}>
      <Ionicons name="fast-food" size={24} color="red" />
    </AnimatedMarker>
  );
}
