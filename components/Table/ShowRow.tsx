import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { isMobileWidth } from "@/shared/utils/constants";
type ShowRowsSelectorProps = {
  rowsPerPage: number;
  onChange: (value: number) => void;
};

export default function ShowRowsSelector({
  rowsPerPage,
  onChange,
}: ShowRowsSelectorProps) {
  return (
    <View style={styles.rowsSelector}>
      <Text style={styles.rowsLabel}>Show rows:</Text>
      <Picker
        selectedValue={rowsPerPage}
        style={styles.picker}
        onValueChange={(value) => onChange(value)}
        dropdownIconColor="#000"
      >
        <Picker.Item label="5" value={5} />
        <Picker.Item label="10" value={10} />
        <Picker.Item label="20" value={20} />
        <Picker.Item label="50" value={50} />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  rowsSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
    flexWrap: "wrap",
  },
  rowsLabel: {
    fontSize: 14,
    color: "#333",
  },
  picker: {
    height: isMobileWidth ? 49 : 40,
    width: isMobileWidth ? 98 : 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
