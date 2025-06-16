import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import io from "socket.io-client";
import useAxios from "@/hooks/useAxios";
import LoadingDots from "@/components/common/LoadingDots";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL;

export default function TrackOrderScreen() {
  const { orderId } = useLocalSearchParams();
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  const bottomAnim = useRef(new Animated.Value(200)).current;

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [partnerAnimatedCoord, setPartnerAnimatedCoord] = useState(null);
  const [eta, setEta] = useState("");
  const [prevEta, setPrevEta] = useState("");
  const [distance, setDistance] = useState("");
  const [expanded, setExpanded] = useState(false);

  const { request: getOrderDetails } = useAxios();

  const getEtaAndDistance = useCallback(
    async (from, to) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&key=${GOOGLE_MAPS_APIKEY}`
        );
        const json = await response.json();

        const leg = json?.routes?.[0]?.legs?.[0];
        if (leg) {
          setDistance(leg.distance?.text || "");

          if (prevEta && leg.duration?.text !== prevEta) {
            ToastAndroid.show(
              `Updated ETA: ${leg.duration.text}`,
              ToastAndroid.SHORT
            );
          }

          setEta(leg.duration?.text || "");
          setPrevEta(leg.duration?.text || "");
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    },
    [prevEta]
  );

  const initializeSocket = useCallback(
    (orderId) => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        timeout: 10000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("join_order_room", orderId);
      });

      socket.on("location_update", (data) => {
        const { orderId: incomingOrderId, location } = data;
        if (
          incomingOrderId === orderId &&
          location?.latitude &&
          location?.longitude &&
          partnerAnimatedCoord
        ) {
          partnerAnimatedCoord
            .timing({
              latitude: location.latitude,
              longitude: location.longitude,
              duration: 1000,
              useNativeDriver: false,
            })
            .start();
          setPartnerLocation(location);
        }
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      return () => {
        socket.disconnect();
      };
    },
    [partnerAnimatedCoord]
  );

  const fetchAndSetup = useCallback(async () => {
    try {
      const { data, error } = await getOrderDetails({
        url: "/user/get-order-by-id",
        method: "GET",
        params: { orderId },
        authRequired: true,
      });

      if (error || data?.status !== 200 || !data.data?.order) {
        console.error("Failed to fetch order data:", error || "Invalid data");
        return;
      }

      const order = data.data.order;
      setOrderDetails(order);

      const drop = {
        latitude: order.deliveryAddress.coordinates.lat,
        longitude: order.deliveryAddress.coordinates.long,
      };

      const partner = {
        latitude: 22.7252, // Default / fallback coordinates
        longitude: 75.865,
      };

      setDropLocation(drop);
      setPartnerLocation(partner);

      const animatedRegion = new AnimatedRegion({
        latitude: partner.latitude,
        longitude: partner.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setPartnerAnimatedCoord(animatedRegion);

      await getEtaAndDistance(partner, drop);

      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      initializeSocket(orderId);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [getOrderDetails, getEtaAndDistance, initializeSocket]);

  useEffect(() => {
    if (!GOOGLE_MAPS_APIKEY) {
      console.error("Missing Google Maps API Key");
      return;
    }

    fetchAndSetup();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const orderInfo = orderDetails
    ? {
        pharmacyName: "Good Health Pharmacy", // Replace if available in data
        totalAmount: `₹${orderDetails.totalAmount.toFixed(2)}`,
        items: orderDetails.items.map((item) => ({
          name: item.medicineName,
          quantity: item.quantity,
          price: item.price.toFixed(2),
        })),
      }
    : {
        pharmacyName: "Good Health Pharmacy",
        totalAmount: "₹0.00",
        items: [],
      };

  console.log(orderDetails);

  if (loading || !dropLocation || !partnerLocation || !partnerAnimatedCoord) {
    return (
      <AppLayout>
        <HeaderWithBack showBackButton title="Track Your Order" />
        <View className="flex-1 items-center justify-center">
          <LoadingDots
            title="Tracking Your Order..."
            subtitle="Please wait..."
          />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout paddingHorizontalCustom paddingVerticalCustom scroll={false}>
      <View className="p-5">
        <HeaderWithBack showBackButton title="Track Your Order" />
      </View>

      <View className="flex-1">
        <MapView
          ref={(ref) => (mapRef.current = ref)}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: dropLocation.latitude,
            longitude: dropLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <MapViewDirections
            origin={partnerLocation}
            destination={dropLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="blue"
            optimizeWaypoints
            onReady={(result) => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
              });
            }}
          />

          <Marker.Animated
            coordinate={partnerAnimatedCoord}
            title="Delivery Partner"
            pinColor="green"
          />

          <Marker
            coordinate={dropLocation}
            title="Delivery Address"
            pinColor="red"
          />
        </MapView>

        <Animated.View
          style={{ transform: [{ translateY: bottomAnim }] }}
          className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-3xl"
        >
          <View className="flex-row justify-evenly items-center bg-gray-100 p-4 rounded-2xl mb-3">
            <View>
              <Text className="text-sm font-semibold text-gray-600">
                Estimated Time
              </Text>
              <Text className="text-base text-gray-900">{eta}</Text>
            </View>
            <View className="h-8 w-0.5 bg-gray-400" />
            <View>
              <Text className="text-sm font-semibold text-gray-600">
                Distance
              </Text>
              <Text className="text-base text-gray-900">{distance}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3 space-x-2">
            <MaterialCommunityIcons
              name="storefront-outline"
              size={24}
              color="#B31F24"
            />
            <Text className="text-xl font-semibold text-gray-900">
              {orderInfo.pharmacyName}
            </Text>
          </View>

          <View className="mb-2 gap-2">
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              className="flex-row justify-between items-center mb-1"
            >
              <Text className="text-base font-semibold">Items</Text>
              <MaterialCommunityIcons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>

            {expanded &&
              orderInfo.items.map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center px-2"
                >
                  <Text className="text-base text-gray-800">
                    {item.quantity} x {item.name}
                  </Text>
                  <Text className="text-base text-gray-700">₹{item.price}</Text>
                </View>
              ))}
          </View>

          <View className="h-0.5 w-full bg-gray-200 my-3" />

          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-gray-900">
              Total Amount
            </Text>
            <Text className="text-xl font-semibold text-gray-900">
              {orderInfo.totalAmount}
            </Text>
          </View>
        </Animated.View>
      </View>
    </AppLayout>
  );
}
