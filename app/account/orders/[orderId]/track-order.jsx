import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Animated, ToastAndroid } from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useLocalSearchParams } from "expo-router";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import io from "socket.io-client";
import useAxios from "@/hooks/useAxios";
import LoadingDots from "@/components/common/LoadingDots";
import OrderTrackingInfoPanel from "@/components/common/OrderTrackingInfoPanel";
import { throttle } from "lodash";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL;

export default function TrackOrderScreen() {
  const { orderId } = useLocalSearchParams();
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const userInteractedRef = useRef(false);
  const initialLocationSetRef = useRef(false);

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

      const handleLocationUpdate = throttle((location) => {
        const liveLocation = {
          latitude: location.lat,
          longitude: location.lng,
        };

        // First-time setup of animated region
        if (!initialLocationSetRef.current) {
          const animatedRegion = new AnimatedRegion({
            ...liveLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          setPartnerLocation(liveLocation);
          setPartnerAnimatedCoord(animatedRegion);
          initialLocationSetRef.current = true;

          // Fetch ETA on first location update
          if (dropLocation) getEtaAndDistance(liveLocation, dropLocation);
          return;
        }

        // Animate on update
        if (partnerAnimatedCoord) {
          partnerAnimatedCoord
            .timing({
              latitude: liveLocation.latitude,
              longitude: liveLocation.longitude,
              duration: 1000,
              useNativeDriver: false,
            })
            .start();

          setPartnerLocation(liveLocation);

          if (!userInteractedRef.current && mapRef.current) {
            mapRef.current.animateCamera(
              {
                center: liveLocation,
                zoom: 16,
              },
              { duration: 1000 }
            );
          }
        }
      }, 2000);

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("join_order_room", orderId);
      });

      socket.on("location_update", (data) => {
        console.log("Received location update:", data);

        const { orderId: incomingOrderId, location } = data;
        if (incomingOrderId === orderId && location?.lat && location?.lng) {
          handleLocationUpdate(location);
        }
      });

      socket.on("disconnect", () => {
        ToastAndroid.show("Disconnected from tracking", ToastAndroid.SHORT);
      });

      socket.on("reconnect", () => {
        ToastAndroid.show("Reconnected to tracking", ToastAndroid.SHORT);
        socket.emit("join_order_room", orderId);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      return () => socket.disconnect();
    },
    [dropLocation, partnerAnimatedCoord, getEtaAndDistance]
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

      setDropLocation(drop);

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
  }, [getOrderDetails, initializeSocket]);

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
        pharmacyName: "Good Health Pharmacy",
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
          onPanDrag={() => {
            userInteractedRef.current = true;
          }}
          onRegionChangeComplete={() => {
            setTimeout(() => {
              userInteractedRef.current = false;
            }, 10000); // resume auto-follow after 10s
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

        <OrderTrackingInfoPanel
          animatedStyle={{ transform: [{ translateY: bottomAnim }] }}
          eta={eta}
          distance={distance}
          pharmacyName={orderInfo.pharmacyName}
          totalAmount={orderInfo.totalAmount}
          items={orderInfo.items}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </View>
    </AppLayout>
  );
}
