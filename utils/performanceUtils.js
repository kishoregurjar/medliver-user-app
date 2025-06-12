import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Device from "expo-device";
import * as Battery from "expo-battery";
import * as Network from "expo-network";
import * as Application from "expo-application";
import { Platform } from "react-native";

const perfLogFile = FileSystem.documentDirectory + "perf-log.json";
const perfCSVFile = FileSystem.documentDirectory + "perf-log.csv";

let perfMarks = {};

// Format timestamp as `YYYY-MM-DD HH:mm:ss`
const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").split(".")[0];
};

// Read JSON file (or return empty object)
const readLogsJSON = async () => {
  try {
    const info = await FileSystem.getInfoAsync(perfLogFile);
    if (!info.exists) return {};
    const content = await FileSystem.readAsStringAsync(perfLogFile);
    return JSON.parse(content);
  } catch {
    return {};
  }
};

// Save updated JSON log
const writeLogsJSON = async (data) => {
  await FileSystem.writeAsStringAsync(
    perfLogFile,
    JSON.stringify(data, null, 2)
  );
};

export const markPerfStart = (label) => {
  perfMarks[label] = performance.now();
};

export const getDeviceExtraInfo = async () => {
  const info = {
    device: Device.modelName ?? "Unknown",
    brand: Device.brand ?? "Unknown",
    manufacturer: Device.manufacturer ?? "Unknown",
    os: Device.osName ?? Platform.OS,
    osVersion: Device.osVersion ?? "N/A",
    platform: Platform.OS,
    deviceYearClass: Device.deviceYearClass ?? "N/A",
    totalMemory: Device.totalMemory ?? "N/A",
    isPhysicalDevice: Device.isDevice ?? false,
    appName: Application.applicationName ?? "UnknownApp",
    appVersion: Application.nativeApplicationVersion ?? "N/A",
    buildNumber: Application.nativeBuildVersion ?? "N/A",
    appOwnership: Application.applicationName || "Unknown", // fallback if needed
    batteryLevel: "N/A",
    powerMode: "N/A",
    networkType: "N/A",
    isConnected: "N/A",
    isInternetReachable: "N/A",
    isForeground: Application.applicationId,
  };

  try {
    const [batteryLevelRes, powerStateRes, networkStateRes, appInfoRes] =
      await Promise.allSettled([
        Battery.getBatteryLevelAsync(),
        Battery.getPowerStateAsync(),
        Network.getNetworkStateAsync(),
      ]);

    if (
      batteryLevelRes.status === "fulfilled" &&
      batteryLevelRes.value != null
    ) {
      info.batteryLevel = (batteryLevelRes.value * 100).toFixed(0) + "%";
    }

    if (powerStateRes.status === "fulfilled") {
      const state = powerStateRes.value;
      info.powerMode = state.lowPowerMode ? "low" : "normal";
    }

    if (networkStateRes.status === "fulfilled") {
      const net = networkStateRes.value;
      info.networkType = net.type;
      info.isConnected = net.isConnected;
      info.isInternetReachable = net.isInternetReachable;
    }
  } catch (e) {
    console.warn("⚠️ Error gathering device extra info:", e);
  }

  return info;
};

export const markPerfEnd = async (label, extra = {}) => {
  const end = performance.now();
  const start = perfMarks[label];
  if (!start) return;

  const duration = end - start;
  const timestamp = formatTimestamp();
  const deviceInfo = await getDeviceExtraInfo();

  const combinedExtra = { ...extra, ...deviceInfo };

  const extraInfo = Object.entries(combinedExtra)
    .map(([key, val]) => `${key}: ${val}`)
    .join(", ");

  const logEntry = {
    label,
    duration: +duration.toFixed(2),
    timestamp,
    extra: extraInfo || null,
  };

  const logs = await readLogsJSON();
  if (!logs[label]) logs[label] = [];
  logs[label].unshift(logEntry);
  if (logs[label].length > 5) logs[label] = logs[label].slice(0, 5);

  await writeLogsJSON(logs);

  console.log(
    `[🟢 PERF] ${label}: ${logEntry.duration} ms at ${timestamp}${
      extraInfo ? ` (${extraInfo})` : ""
    }`
  );

  delete perfMarks[label];
};

export const exportPerfLogsToConsole = async () => {
  const logs = await readLogsJSON();
  console.log("[📦 EXPORTING PERF LOGS]");
  Object.entries(logs).forEach(([label, entries]) => {
    console.log(`\n📌 ${label}`);
    entries.forEach((entry, index) => {
      console.log(
        `#${index + 1} ➤ ${entry.duration} ms @ ${entry.timestamp}${
          entry.extra ? ` (${entry.extra})` : ""
        }`
      );
    });
  });
};

export const exportPerfLogsToCSV = async () => {
  const logs = await readLogsJSON();

  const csvLines = [["Label", "Duration (ms)", "Timestamp", "Extra"]];
  Object.entries(logs).forEach(([label, entries]) => {
    entries.forEach((entry) => {
      csvLines.push([
        label,
        entry.duration,
        entry.timestamp,
        entry.extra || "",
      ]);
    });
  });

  const csvContent = csvLines.map((line) => line.join(",")).join("\n");
  await FileSystem.writeAsStringAsync(perfCSVFile, csvContent);
  console.log("✅ CSV exported to:", perfCSVFile);
  return perfCSVFile;
};

export const clearPerfLogs = async () => {
  await FileSystem.writeAsStringAsync(perfLogFile, "{}");
};

export const getAllPerfLogs = async () => {
  const logs = await readLogsJSON();
  let output = "";

  Object.entries(logs).forEach(([label, entries]) => {
    output += `📂 ${label}\n`;
    entries.forEach((entry, i) => {
      output += `#${i + 1} ➤ ${entry.duration} ms @ ${entry.timestamp}${
        entry.extra ? ` (${entry.extra})` : ""
      }\n`;
    });
    output += "\n";
  });

  return output || "No logs yet.";
};

export const shareCSVFile = async () => {
  const uri = await exportPerfLogsToCSV();
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: "text/csv" });
  }
};

export const shareTxtFile = async () => {
  const txtPath = FileSystem.documentDirectory + "perf-log.txt";
  const content = await getAllPerfLogs();
  await FileSystem.writeAsStringAsync(txtPath, content);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(txtPath, { mimeType: "text/plain" });
  }
};
