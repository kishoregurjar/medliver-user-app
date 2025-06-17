import "dotenv/config";

export default {
  expo: {
    name: "Medlivurr",
    slug: "medlivurr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logos/logo.png",
    scheme: "medlivurr",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",
    newArchEnabled: true,
    owner: "medlivurr",

    splash: {
      image: "./assets/logos/logo_s_text.png",
      resizeMode: "contain",
      backgroundColor: "#FCDEC7",
    },

    ios: {
      bundleIdentifier: "com.anonymous.medlivurr",
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["location"],
        NSLocationWhenInUseUsageDescription:
          "Medlivurr needs your location to deliver medicines and manage lab appointments.",
      },
    },

    android: {
      package: "com.anonymous.medlivurr",
      googleServicesFile: "./google-services.json",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "INTERNET",
        "FOREGROUND_SERVICE",
        "ACCESS_NETWORK_STATE",
        "RECEIVE_BOOT_COMPLETED",
        "WAKE_LOCK",
        "VIBRATE",
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/logos/logo.png",
        backgroundColor: "#ffffff",
      },
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/logos/logo.png",
    },

    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/logos/logo_s_text.png",
          resizeMode: "contain",
          backgroundColor: "#FCDEC7",
          dark: {
            image: "./assets/logos/logo_s_text.png",
            backgroundColor: "#FCDEC7",
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      eas: {
        projectId: "e64116bb-dd2b-4ff6-a1cf-6bcf20041257",
      },
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_SOCKET_SERVER_URL: process.env.EXPO_PUBLIC_SOCKET_SERVER_URL,
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY:
        process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
};
