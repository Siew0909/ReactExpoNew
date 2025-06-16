// components/TableSection.js
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type Person = {
  id: number | string;
  fullname: string;
  email: string;
  age: number;
};

type SortConfig = {
  key: keyof Person;
  direction: "asc" | "desc" | "";
};
type PersonTableProps = {
  data: Person[];
  sortConfig: SortConfig;
  onSort: (key: keyof Person) => void;
};

export default function PersonTable({
  data,
  sortConfig,
  onSort,
}: PersonTableProps) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "fullname", label: "Fullname" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "contact_no", label: "Contact Number" },
    { key: "username", label: "Username" },
  ];
  const { width: screenWidth } = useWindowDimensions();

  const renderHeader = () => (
    <View style={styles.row}>
      {columns.map((col) => {
        const isSorted = sortConfig.key === col.key;
        let sortSymbol: React.ReactNode = null;
        if (isSorted) {
          sortSymbol =
            sortConfig.direction === "asc" ? (
              <MaterialIcons name="arrow-upward" style={{ marginLeft: 5 }} />
            ) : sortConfig.direction === "desc" ? (
              <MaterialIcons name="arrow-downward" style={{ marginLeft: 5 }} />
            ) : null;
        }

        return (
          <Pressable
            key={col.key}
            style={[styles.cell, styles.header]}
            onPress={() => onSort(col.key)}
          >
            <Text style={styles.headerText}>
              {col.label}
              {sortSymbol}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {columns.map((col) => (
        <Text key={col.key} style={styles.cell}>
          {item[col.key]}
        </Text>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.table}>
        {renderHeader()}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }} // give breathing room at the bottom
        />
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
  },
  table: {
    minWidth: 800, // Force scrolling if screen is narrower
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    
  },
  cell: {
    flex: 1,
    padding: 12,
  },
  header: {
    backgroundColor: "#e0e0e0",
  },
  headerText: {
    fontWeight: "bold",
  },
});
