import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Transaction = {
  trx_id: string;
  transaction_date: string;
  customer_name: string;
  number_id: string;
  msisdn: string;
  amount: number;
};

type SortConfig = {
  key: keyof Transaction | null;
  direction: "asc" | "desc" | null;
};

type TransactionTableProps = {
  data: Transaction[];
  sortConfig: SortConfig;
  onSort: (key: keyof Transaction) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  totalRows: number;
};

export default function TransactionTable({
  data,
  sortConfig,
  onSort,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalRows,
}: TransactionTableProps) {
  const columns = [
    { key: "trx_id", label: "Transaction ID" },
    { key: "transaction_date", label: "Transaction Date" },
    { key: "customer_name", label: "Customer Name" },
    { key: "number_id", label: "Number ID" },
    { key: "msisdn", label: "MSISDN" },
    { key: "amount", label: "Amount" },
  ];

  const renderHeader = () => (
    <View style={styles.row}>
      {columns.map((col) => {
        const isSorted = sortConfig.key === col.key;
        const icon = isSorted ? (
          sortConfig.direction === "asc" ? (
            <MaterialIcons name="arrow-upward" size={14} />
          ) : sortConfig.direction === "desc" ? (
            <MaterialIcons name="arrow-downward" size={14} />
          ) : null
        ) : null;

        return (
          <Pressable
            key={col.key}
            style={[styles.cell, styles.header]}
            onPress={() => onSort(col.key)}
          >
            <Text style={styles.headerText}>
              {col.label} {icon}
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
          {item[col.key]?.toString()}
        </Text>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.table}>
        {renderHeader()}
        {data.length === 0 ? (
          <Text style={{ padding: 20, textAlign: "center" }}>
            No transactions match the filter.
          </Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.trx_id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScrollView>
  );
}

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
