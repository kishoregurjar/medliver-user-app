import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import AppLayout from "@/components/layouts/AppLayout";

// ✅ Production-safe fallback screen
function DevOnlyPlaceholder() {
  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Dev Performance Logs" />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-bold text-red-500">Access Denied</Text>
        <Text className="text-sm text-gray-600 text-center mt-2">
          This screen is only available in development mode.
        </Text>
      </View>
    </AppLayout>
  );
}

// ✅ Main Dev screen
function DevPerfScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    getAllPerfLogs,
    clearPerfLogs,
    exportPerfLogsToCSV,
    exportPerfLogsToConsole,
    shareCSVFile,
    shareTxtFile,
  } = require("@/utils/performanceUtils");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const logText = await getAllPerfLogs();
      setLogs(logText?.split("\n") || []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  const exportCSVAndNotify = async () => {
    const path = await exportPerfLogsToCSV();
    Alert.alert("CSV Exported", `File saved at:\n${path}`);
  };

  const formatTime = (date) =>
    date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : "";

  const ActionButton = ({ label, onPress, className }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 px-3 py-2 rounded-lg m-1 ${className}`}
    >
      <Text className="text-center font-lexend text-xs">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Dev Performance Logs" />
      <View className="flex-1 p-4">
        <Text className="text-sm font-lexend-bold mb-1 text-gray-700">
          Logs Output:
        </Text>
        {lastUpdated && (
          <Text className="text-xs text-gray-500 mb-2">
            Last updated: {formatTime(lastUpdated)}
          </Text>
        )}

        <View className="bg-background-soft max-h-96 p-4 rounded-2xl mb-4">
          {loading && !refreshing ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator size="small" color="#4B5563" />
              <Text className="text-xs mt-2 text-gray-600 font-lexend">
                Fetching logs...
              </Text>
            </View>
          ) : (
            <FlatList
              data={logs}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Text className="text-[10px] text-gray-800 font-mono mb-1">
                  {item}
                </Text>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    fetchLogs();
                  }}
                />
              }
              ListEmptyComponent={() => (
                <View className="py-10 items-center justify-center">
                  <Text className="text-xs text-gray-600 font-lexend">
                    No logs found.
                  </Text>
                </View>
              )}
            />
          )}
        </View>

        <View className="bg-white rounded-2xl p-4">
          <Text className="text-sm font-lexend-bold mb-2 text-gray-800">
            🔄 Log Actions
          </Text>
          <View className="flex-row flex-wrap mb-4">
            <ActionButton
              label="Refresh Logs"
              onPress={fetchLogs}
              className="bg-blue-100 text-blue-700"
            />
            <ActionButton
              label="Clear Logs"
              onPress={() => {
                clearPerfLogs();
                setLogs([]);
                setLastUpdated(new Date());
              }}
              className="bg-red-100 text-red-700"
            />
          </View>

          <Text className="text-sm font-lexend-bold mb-2 text-gray-800">
            📁 Export Options
          </Text>
          <View className="flex-row flex-wrap mb-4">
            <ActionButton
              label="Export to Console"
              onPress={exportPerfLogsToConsole}
              className="bg-indigo-100 text-indigo-700"
            />
            <ActionButton
              label="Export to CSV"
              onPress={exportCSVAndNotify}
              className="bg-green-100 text-green-700"
            />
          </View>

          <Text className="text-sm font-lexend-bold mb-2 text-gray-800">
            📤 Share Logs
          </Text>
          <View className="flex-row flex-wrap">
            <ActionButton
              label="Share CSV"
              onPress={shareCSVFile}
              className="bg-yellow-100 text-yellow-700"
            />
            <ActionButton
              label="Share TXT"
              onPress={shareTxtFile}
              className="bg-purple-100 text-purple-700"
            />
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

// ✅ Export safely based on dev mode
export default __DEV__ ? DevPerfScreen : DevOnlyPlaceholder;
