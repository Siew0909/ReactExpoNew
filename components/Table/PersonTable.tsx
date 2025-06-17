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
  View,
} from "react-native";
import HorizontalDivider from "../Dividers/HorizontalDivider";
import VerticalDivider from "../VerticalDivider";

type Person = {
  id: number | string;
  fullname: string;
  email: string;
  age: number;
  contact_no: string;
  username: string;
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
    { key: "expand", label: "", flex: 0.5 },
    { key: "fullname", label: "Fullname", flex: 1.2 },
    { key: "email", label: "Email", flex: 2 },
    { key: "age", label: "Age", flex: 0.7 },
    { key: "contact_no", label: "Contact Number", flex: 1.5 },
    { key: "username", label: "Username", flex: 1 },
  ];
  const [expandedRowId, setExpandedRowId] = React.useState<
    number | string | null
  >(null);

  const renderHeader = () => (
    <View style={styles.row}>
      {columns.map((col) => {
        if (col.key === "expand") {
          return (
            <View
              key="expand"
              style={[
                styles.cell,
                styles.header,
                styles.expandCell,
                { flex: col.flex },
              ]}
            />
          );
        }
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
            onPress={() => onSort(col.key as keyof Person)}
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

  const renderItem = ({ item, index }: { item: Person; index: number }) => {
    const isExpanded = expandedRowId === item.id;

    return (
      <>
        <View style={styles.row}>
          <View style={[styles.cell, styles.expandCell]}>
            <Pressable
              onPress={() => setExpandedRowId(isExpanded ? null : item.id)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: "#007aff",
              }}
            >
              <MaterialIcons
                name={
                  isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"
                }
                size={20}
              />
            </Pressable>
          </View>
          <Text style={styles.cell}>{item.fullname}</Text>
          <Text style={[styles.cell, styles.linkText]}>{item.email}</Text>
          <Text style={[styles.cell, styles.boldText]}>{item.age}</Text>
          <Text style={styles.cell}>{item.contact_no}</Text>
          <Text style={styles.cell}>{item.username}</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedContentContainer}>
            <View style={styles.expandedCard}>
              <Text style={styles.sectionTitle}>Customer Details</Text>
              <HorizontalDivider />
              <Text style={styles.detailText}>
                <Text style={styles.label}>Name: </Text>
                {item.fullname}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Email: </Text>
                {item.email}
              </Text>
            </View>
            <VerticalDivider />
            <View style={styles.expandedCard}>
              <Text style={styles.sectionTitle}>Account Details</Text>
              <HorizontalDivider />
              <Text style={styles.detailText}>
                <Text style={styles.label}>Age: </Text>
                {item.age}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Contact: </Text>
                {item.contact_no}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Username: </Text>
                {item.username}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };
  return (
    <ScrollView style={styles.scroll} horizontal>
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
    minWidth: Dimensions.get("window").width, // Add extra room for right-most columns
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
  expandCell: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: "#007aff",
    textDecorationLine: "underline",
  },
  boldText: {
    fontWeight: "bold",
  },
  expandedContentContainer: {
    flexDirection: "row",
    backgroundColor: "#fdfdfd",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  expandedCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "transparent",
    padding: 5,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    color: "#222",
  },
});
