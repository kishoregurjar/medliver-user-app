// utils/notification.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted for notifications!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    if (__DEV__) {
      console.log(
        `------------------------- [DEV] Expo Push Notification Token Status: ${finalStatus} -------------------------`
      );
      console.log("[DEV] Expo Push Notification Token:", token);
    }
  } else {
    alert("Push notifications require a physical device");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

// Only works on physical device (not simulator)
export const getFCMToken = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
  const tokenData = await Notifications.getDevicePushTokenAsync({
    type: "fcm",
  });
  if (__DEV__) {
    console.log(
      `------------------------- [DEV] FCM Token Status: ${status} -------------------------`
    );

    console.log("[DEV] FCM Token Data:", tokenData);
    console.log("[DEV] Device Push Token:", tokenData.data);
    console.log("[DEV] Device Push Token Type:", tokenData.type);
  }
};
