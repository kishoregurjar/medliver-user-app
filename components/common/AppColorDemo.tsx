import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";

const AppColorDemo = () => {
  const [selectedColor, setSelectedColor] = useState("app-color-red");
  const [selectedType, setSelectedType] = useState("bg");

  const colorKeys = [
    "app-color-brown",
    "app-color-lightbrown",
    "app-color-red",
    "app-color-black",
    "app-color-white",
    "app-color-grey",
    "app-color-green",
    "app-color-pink",
    "app-color-lightgrey",
    "app-color-lightblue",
    "app-color-deepblue",
    "app-color-mintgreen",
    "app-color-indigo",
    "app-color-softindigo",
    "app-color-royalblue",
    "app-color-midblue",
    "app-color-maroon",
    "app-color-blue",
  ];

  const types = ["bg", "text", "border", "button"];

  const getClassName = () => {
    switch (selectedType) {
      case "bg":
        return `bg-${selectedColor} p-4 rounded-xl`;
      case "text":
        return `bg-white p-4 rounded-xl`;
      case "border":
        return `border-2 border-${selectedColor} bg-white p-4 rounded-xl`;
      case "button":
        return `bg-${selectedColor} py-3 px-6 rounded-xl`;
      default:
        return "";
    }
  };

  const renderPreview = () => {
    const className = getClassName();

    if (selectedType === "button") {
      return (
        <Pressable className={className}>
          <Text className="text-white text-center font-semibold">
            Demo Button
          </Text>
        </Pressable>
      );
    }

    return (
      <View className={className}>
        <Text
          className={
            selectedType === "text"
              ? `text-${selectedColor}`
              : "text-app-color-black"
          }
        >
          {`${selectedType}-${selectedColor}`}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView className="p-4 pb-20">
      <Text className="text-lg font-bold mb-2">🎨 Select Color:</Text>
      <View className="flex flex-row flex-wrap gap-2 mb-6">
        {colorKeys.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedColor(color)}
            className={`px-3 py-2 rounded-full border ${
              selectedColor === color ? "border-black" : "border-gray-300"
            }`}
          >
            <Text className="text-sm">{color}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-bold mb-2">🧩 Select Type:</Text>
      <View className="flex-row gap-4 mb-6 flex-wrap">
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full border ${
              selectedType === type ? "border-black" : "border-gray-300"
            }`}
          >
            <Text className="text-sm capitalize">{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-bold mb-3">👀 Preview:</Text>
      {renderPreview()}
    </ScrollView>
  );
};

export default AppColorDemo;
