// components/VerticalDivider.tsx
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  style?: ViewStyle;
};

export default function VerticalDivider({ style }: Props) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 12,
  },
});