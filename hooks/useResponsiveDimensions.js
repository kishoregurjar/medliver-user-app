import { useWindowDimensions } from "react-native";

/**
 * Custom hook to get responsive width and height based on percentage of screen.
 * @returns {{
 *   getWidthPercent: (percent: number) => number,
 *   getHeightPercent: (percent: number) => number
 * }}
 */
const useResponsiveDimensions = () => {
  const { width, height } = useWindowDimensions();

  const getWidthPercent = (percent) => (percent / 100) * width;
  const getHeightPercent = (percent) => (percent / 100) * height;

  return { getWidthPercent, getHeightPercent };
};

export default useResponsiveDimensions;
