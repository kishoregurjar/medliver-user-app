import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import {
  getAllPerfLogs,
  clearPerfLogs,
  exportPerfLogsToCSV,
  exportPerfLogsToConsole,
} from "@/utils/performanceUtils";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";

export default function PerfDevScreen() {
  const [logs, setLogs] = useState("");

  const fetchLogs = async () => {
    const logText = await getAllPerfLogs();
    setLogs(logText);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Dev Performance Logs" />
      <ScrollView className="flex-1">
        <Text className="text-xl font-lexend-bold mb-4 text-center">
          Performance Logs
        </Text>

        <TouchableOpacity onPress={fetchLogs} className="mb-2">
          <Text className="text-blue-600 font-lexend">🔄 Refresh Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearPerfLogs} className="mb-2">
          <Text className="text-red-600 font-lexend">🗑️ Clear Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={exportPerfLogsToCSV} className="mb-2">
          <Text className="text-green-600 font-lexend">📁 Export to CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={exportPerfLogsToConsole} className="mb-4">
          <Text className="text-indigo-600 font-lexend">
            🖨️ Export to Console
          </Text>
        </TouchableOpacity>

        <Text className="text-xs whitespace-pre-line text-gray-800 font-lexend">
          {logs}
        </Text>
      </ScrollView>
    </AppLayout>
  );
}
