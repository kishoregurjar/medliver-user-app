import * as FileSystem from "expo-file-system";

const perfLogFile = FileSystem.documentDirectory + "perf-log.txt";

let perfMarks = {};

export const markPerfStart = (label) => {
  perfMarks[label] = performance.now();
};

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

  await FileSystem.appendAsStringAsync(perfLogFile, message);
  delete perfMarks[label];
};

export const exportPerfLogsToConsole = async () => {
  const logs = await FileSystem.readAsStringAsync(perfLogFile);
  console.log("[📦 EXPORTING PERF LOGS]", logs);
};

export const exportPerfLogsToCSV = async () => {
  const logs = await FileSystem.readAsStringAsync(perfLogFile);
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
  const csvPath = FileSystem.documentDirectory + "perf-log.csv";

  await FileSystem.writeAsStringAsync(csvPath, csvContent);
  console.log("CSV exported to:", csvPath);
  return csvPath;
};

export const clearPerfLogs = async () => {
  await FileSystem.writeAsStringAsync(perfLogFile, "");
};

export const getAllPerfLogs = async () => {
  return await FileSystem.readAsStringAsync(perfLogFile);
};
