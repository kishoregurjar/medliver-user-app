import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const LOG_FILENAME = "perf-log.txt";
const CSV_FILENAME = "perf-log.csv";

const perfLogFile = FileSystem.documentDirectory + LOG_FILENAME;
const perfCSVFile = FileSystem.documentDirectory + CSV_FILENAME;

let perfMarks = {};

// Start perf timer
export const markPerfStart = (label) => {
  perfMarks[label] = performance.now();
};

// End perf timer and log
export const markPerfEnd = async (label, extra = {}) => {
  const end = performance.now();
  const start = perfMarks[label];
  if (!start) return;

  const duration = end - start;
  const extraInfo = Object.entries(extra)
    .map(([key, val]) => `${key}: ${val}`)
    .join(", ");

  const message = `[🟢 PERF] ${label}: ${duration.toFixed(2)} ms${
    extraInfo ? ` (${extraInfo})` : ""
  }\n`;

  console.log(message);
  await FileSystem.writeAsStringAsync(perfLogFile, message, { append: true });
  delete perfMarks[label];
};

// Export all logs to console
export const exportPerfLogsToConsole = async () => {
  try {
    const logs = await getAllPerfLogs();
    console.log("[📦 EXPORTING PERF LOGS]\n" + logs);
  } catch (e) {
    console.error("❌ Error reading logs for console export:", e);
  }
};

// Export logs to CSV format
export const exportPerfLogsToCSV = async () => {
  try {
    const logs = await getAllPerfLogs();
    const lines = logs
      .trim()
      .split("\n")
      .map((line) => line.replace("[🟢 PERF] ", "").trim());

    const csv = lines.map((line) => {
      const [label, durationWithExtra] = line.split(":");
      const [duration, ...extra] = durationWithExtra.trim().split(" ");
      return `${label},${duration.replace("ms", "")},${extra.join(" ")}`;
    });

    const csvContent = "Label,Duration (ms),Extra\n" + csv.join("\n");

    await FileSystem.writeAsStringAsync(perfCSVFile, csvContent);
    console.log("✅ CSV exported to:", perfCSVFile);
    return perfCSVFile;
  } catch (e) {
    console.error("❌ Error exporting CSV:", e);
  }
};

// Clear logs
export const clearPerfLogs = async () => {
  await FileSystem.writeAsStringAsync(perfLogFile, "");
};

// Read logs
export const getAllPerfLogs = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(perfLogFile);
    if (!fileInfo.exists) return "No logs yet.";
    return await FileSystem.readAsStringAsync(perfLogFile);
  } catch (e) {
    console.error("❌ Failed to read logs:", e);
    return "Error reading logs.";
  }
};

// Optional: Share CSV file using system UI
export const shareCSVFile = async () => {
  const uri = await exportPerfLogsToCSV();
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: "text/csv" });
  } else {
    console.warn("Sharing not available on this device");
  }
};

// Optional: Share TXT file using system UI
export const shareTxtFile = async () => {
  const fileInfo = await FileSystem.getInfoAsync(perfLogFile);
  if (fileInfo.exists && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(perfLogFile, { mimeType: "text/plain" });
  }
};
