import { useEffect, useRef, useState, useCallback } from "react";
import { ToastAndroid } from "react-native";
import io from "socket.io-client";
import { throttle } from "lodash";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL;

export default function useLiveTracking(dropLocation, orderId) {
  const socketRef = useRef(null);
  const initialLocationSetRef = useRef(false);
  const previousPolylineRef = useRef([]);

  const [partnerLocation, setPartnerLocation] = useState(null);
  const [animatedPolyline, setAnimatedPolyline] = useState([]);
  const [eta, setEta] = useState("");
  const [distance, setDistance] = useState("");

  const getEtaAndDistance = useCallback(async (from, to) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const json = await response.json();
      const leg = json?.routes?.[0]?.legs?.[0];

      if (leg) {
        setDistance(leg.distance?.text || "");
        setEta(leg.duration?.text || "");
        const newPolyline = json.routes?.[0]?.overview_polyline?.points;

        if (newPolyline) {
          const decoded = decodePolyline(newPolyline);
          setAnimatedPolyline(decoded);
          previousPolylineRef.current = decoded;
        }
      }
    } catch (err) {
      console.error("ETA fetch failed:", err);
    }
  }, []);

  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const initializeSocket = useCallback(() => {
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

      setPartnerLocation(liveLocation);

      if (!initialLocationSetRef.current && dropLocation) {
        getEtaAndDistance(liveLocation, dropLocation);
        initialLocationSetRef.current = true;
      } else {
        const lastPolyline = previousPolylineRef.current;
        const dist = calculateDistance(lastPolyline, dropLocation);
        if (dist > 0.5) {
          getEtaAndDistance(liveLocation, dropLocation); // Re-fetch if too far
        }
      }
    }, 2000);

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("join_order_room", orderId);
    });

    socket.on("location_update", (data) => {
      if (data?.orderId === orderId && data?.location) {
        handleLocationUpdate(data.location);
      }
    });

    socket.on("disconnect", () => {
      ToastAndroid.show("Disconnected from tracking", ToastAndroid.SHORT);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => socket.disconnect();
  }, [dropLocation, getEtaAndDistance]);

  const calculateDistance = (from, to) => {
    if (!from || !to) return 0;
    const last = from[from.length - 1];
    const R = 6371;
    const dLat = ((to.latitude - last.latitude) * Math.PI) / 180;
    const dLon = ((to.longitude - last.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((last.latitude * Math.PI) / 180) *
        Math.cos((to.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!orderId || !dropLocation) return;
    const cleanup = initializeSocket();
    return () => cleanup && cleanup();
  }, [dropLocation, orderId]);

  return {
    partnerLocation,
    animatedPolyline,
    eta,
    distance,
  };
}
