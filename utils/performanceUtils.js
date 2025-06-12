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

const getDeviceExtraInfo = async () => {
  const result = {
    device: Device.modelName ?? "Unknown Device",
    os: Device.osName ?? Platform.OS,
    osVersion: Device.osVersion ?? "N/A",
    platform: Platform.OS,
    batteryLevel: "Unavailable",
    networkType: "Unavailable",
    isForeground: false,
  };

  // Fetch battery and network info in parallel
  try {
    const [battery, network] = await Promise.allSettled([
      Battery.getBatteryLevelAsync(),
      Network.getNetworkStateAsync(),
    ]);

    if (battery.status === "fulfilled" && battery.value != null) {
      result.batteryLevel = (battery.value * 100).toFixed(0) + "%";
    } else {
      console.warn("❌ Battery error:", battery.reason);
    }

    if (network.status === "fulfilled" && network.value) {
      result.networkType = network.value.type ?? "Unavailable";
    } else {
      console.warn("❌ Network error:", network.reason);
    }
  } catch (e) {
    console.warn("❌ Unexpected error during battery/network fetch:", e);
  }

  // Foreground state
  try {
    result.isForeground = Application.applicationState === "foreground";
  } catch (e) {
    console.warn("❌ Foreground state error:", e);
  }

  return result;
};

export const markPerfEnd = async (label, extra = {}) => {
  const end = performance.now();
  const start = perfMarks[label];
  if (!start) return;

  const duration = end - start;
  const timestamp = formatTimestamp();
  const deviceInfo = await getDeviceExtraInfo();

  console.log(deviceInfo, "deviceInfo");

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
