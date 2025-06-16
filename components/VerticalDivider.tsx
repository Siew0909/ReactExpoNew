import { StyleSheet, View } from "react-native";

export default function VerticalDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    width: 2,
    alignSelf: "stretch",
    backgroundColor: "#ccc",
    marginVertical: 12,
    marginHorizontal: 8,
  },
});
