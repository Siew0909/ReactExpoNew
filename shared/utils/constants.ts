import { Dimensions } from "react-native";

// Define your breakpoints
export const MOBILE_BREAKPOINT = 768; // For tablets and larger, show table view

// Optional: A helper function to easily check if it's mobile or desktop
export const isMobileWidth = Dimensions.get("window").width < MOBILE_BREAKPOINT;
export const isTabletOrDesktopWidth =
  Dimensions.get("window").width >= MOBILE_BREAKPOINT;

// If you have more complex breakpoints or specific device sizes, you might expand this:
export const BREAKPOINTS = {
  sm: 0, // Smallest screens
  md: 480, // Medium screens (larger phones)
  lg: 768, // Large screens (tablets)
  xl: 1024, // Extra large screens (desktops)
};

// You can create functions to query them:
export const getCurrentBreakpoint = () => {
  const width = Dimensions.get("window").width;
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  return "sm";
};
