import AsyncStorage from "@react-native-async-storage/async-storage";

export const logAsyncStorage = async () => {
  if (__DEV__) {
    try {
      console.log(
        "------------------------- [DEV] Logging AsyncStorage -------------------------"
      );
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();

      if (keys.length === 0) {
        console.log("[DEV] AsyncStorage: No items found");
        return "No items in AsyncStorage";
      }

      // Log all keys first
      console.log("[DEV] AsyncStorage Keys:", keys);
      console.log("[DEV] AsyncStorage Key Count:", keys.length);

      // Get all key-value pairs
      const items = await AsyncStorage.multiGet(keys);

      // Log each key with its value
      console.log("[DEV] AsyncStorage Key-Value Pairs:");
      items.forEach(([key, value]) => {
        console.log(`[DEV] Key: ${key}, Value: ${value}`);
      });

      // Return object with all key-value pairs
      return items.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    } catch (error) {
      console.error("[DEV] AsyncStorage Error:", error);
      return null;
    }
  }
  return null; // Return null if not in developer mode
};

export const helpers = {
  logAsyncStorage,
};
