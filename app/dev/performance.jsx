import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import {
  getAllPerfLogs,
  clearPerfLogs,
  exportPerfLogsToCSV,
  exportPerfLogsToConsole,
  shareCSVFile,
  shareTxtFile,
} from "@/utils/performanceUtils";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";

export default function PerfDevScreen() {
  const [logs, setLogs] = useState("");

  const fetchLogs = async () => {
    const logText = await getAllPerfLogs();
    setLogs(logText);
  };

  const exportCSVAndNotify = async () => {
    const path = await exportPerfLogsToCSV();
    Alert.alert("✅ CSV Exported", `File saved at:\n${path}`);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const ActionButton = ({ label, onPress, className }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-3 rounded-xl mb-2 ${className}`}
    >
      <Text className="text-center font-lexend text-sm">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Dev Performance Logs" />

      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-lexend-bold mb-4 text-center">
          Performance Logs
        </Text>

        {/* Logs Actions */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-sm font-lexend-bold mb-2 text-gray-800">
            🔄 Log Actions
          </Text>

          <ActionButton
            label="🔁 Refresh Logs"
            onPress={fetchLogs}
            className="bg-blue-100 text-blue-700"
          />

          <ActionButton
            label="🗑️ Clear Logs"
            onPress={() => {
              clearPerfLogs();
              setLogs("");
            }}
            className="bg-red-100 text-red-700"
          />
        </View>

        {/* Export Actions */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-sm font-lexend-bold mb-2 text-gray-800">
            📁 Export Options
          </Text>

          <ActionButton
            label="🧾 Export to Console"
            onPress={exportPerfLogsToConsole}
            className="bg-indigo-100 text-indigo-700"
          />

          <ActionButton
            label="📊 Export to CSV"
            onPress={exportCSVAndNotify}
            className="bg-green-100 text-green-700"
          />
        </View>

        {/* Share Actions */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-sm font-lexend-bold mb-2 text-gray-800">
            📤 Share Logs
          </Text>

          <ActionButton
            label="📄 Share CSV File"
            onPress={shareCSVFile}
            className="bg-yellow-100 text-yellow-700"
          />

          <ActionButton
            label="📝 Share TXT File"
            onPress={shareTxtFile}
            className="bg-purple-100 text-purple-700"
          />
        </View>

        {/* Logs Display */}
        <Text className="text-sm font-lexend-bold mb-1 text-gray-700">
          🧾 Logs Output:
        </Text>

        <ScrollView className="bg-gray-100 p-3 rounded-lg max-h-96" horizontal>
          <Text className="text-xs font-mono text-gray-800 whitespace-pre">
            {logs || "No logs available. Try refreshing."}
          </Text>
        </ScrollView>
      </ScrollView>
    </AppLayout>
  );
}
