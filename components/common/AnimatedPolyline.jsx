import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import MapView, { Polyline } from "react-native-maps";

export default function AnimatedPolyline({
  coordinates,
  strokeColor = "blue",
  strokeWidth = 4,
}) {
  const [prevCoords, setPrevCoords] = useState([]);
  const [opacityAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (coordinates.length === 0) return;

    // Fade out old polyline
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setPrevCoords(coordinates);
      // Fade in new polyline
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [coordinates]);

  return (
    <>
      {prevCoords.length > 0 && (
        <Polyline
          coordinates={prevCoords}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}
      <Animated.View style={{ opacity: opacityAnim }}>
        <MapView.Polyline
          coordinates={coordinates}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />
      </Animated.View>
    </>
  );
}
