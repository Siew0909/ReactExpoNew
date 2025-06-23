// components/Table/TransactionTable.tsx
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HorizontalDivider from "../Dividers/HorizontalDivider";
import VerticalDivider from "../VerticalDivider";

type Item = {
  id: number;
  product_id: string;
  qty: string;
  price: string;
  total: string;
  phone_number: string;
  package: {
    id: string;
    name: string;
  };
};

type Transaction = {
  trx_id: string;
  transaction_date: string;
  customer_name: string;
  number_id: string;
  msisdn: string;
  amount: number;
  items: Item[];
};

type SortConfig = {
  key: keyof Transaction;
  direction: "asc" | "desc" | "";
};

type Props = {
  data: Transaction[];
  sortConfig: SortConfig;
  onSort: (key: keyof Transaction) => void;
};

export default function TransactionTable({ data, sortConfig, onSort }: Props) {
  const columns = [
    { key: "expand", label: "", width: 0.5 },
    { key: "trx_id", label: "Transaction ID", width: 2 },
    { key: "customer_name", label: "Customer", width: 1.5 },
    { key: "amount", label: "Amount", width: 1 },
  ];

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const renderHeader = () => (
    <View style={styles.row}>
      {columns.map((col) => {
        if (col.key === "expand") {
          return <View key="expand" style={[styles.cell, styles.expandCell, styles.header]} />;
        }
        const isSorted = sortConfig.key === col.key;
        const sortSymbol = isSorted ? (
          sortConfig.direction === "asc" ? (
            <MaterialIcons name="arrow-upward" />
          ) : (
            <MaterialIcons name="arrow-downward" />
          )
        ) : null;

        return (
          <Pressable
            key={col.key}
            style={[styles.cell, styles.header]}
            onPress={() => onSort(col.key as keyof Transaction)}
          >
            <Text style={styles.headerText}>
              {col.label} {sortSymbol}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => {
    const isExpanded = expandedRowId === item.trx_id;
    return (
      <>
        <View style={styles.row}>
          <View style={[styles.cell, styles.expandCell]}>
            <Pressable
              onPress={() => setExpandedRowId(isExpanded ? null : item.trx_id)}
              style={styles.expandButton}
            >
              <MaterialIcons
                name={
                  isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"
                }
                size={20}
              />
            </Pressable>
          </View>
          <Text style={styles.cell}>{item.trx_id}</Text>
          <Text style={styles.cell}>{item.customer_name}</Text>
          <Text style={styles.cell}>${item.amount}</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedContentContainer}>
            <View style={styles.expandedCard}>
              <Text style={styles.sectionTitle}>Details</Text>
              <HorizontalDivider />
              <Text style={styles.detailText}>
                <Text style={styles.label}>MSISDN: </Text>
                {item.msisdn}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Date: </Text>
                {item.transaction_date}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Number ID: </Text>
                {item.number_id}
              </Text>
            </View>
            <VerticalDivider />
            <View style={styles.expandedCard}>
              <Text style={styles.sectionTitle}>Items</Text>
              <HorizontalDivider />
              {item.items.map((itm) => (
                <View key={itm.id} style={{ marginBottom: 6 }}>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Package: </Text>
                    {itm.package.name}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Qty: </Text>
                    {itm.qty}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.label}>Total: </Text>${itm.total}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.scroll}>
      <View style={styles.table}>
        {renderHeader()}
        {data.length === 0 ? (
          <Text style={styles.noDataText}>No Data Record</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.trx_id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
  },
  table: {
    minWidth: screenWidth < 600 ? screenWidth : undefined,
    flexGrow: 1,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "#888",
    fontStyle: "italic",
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
  expandButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#007aff",
  },
  expandedContentContainer: {
    flexDirection: screenWidth < 600 ? "column" : "row",
    backgroundColor: "#fdfdfd",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    justifyContent: "space-between",
    gap: 10,
  },
  expandedCard: {
    flex: 1,
    minWidth: screenWidth < 600 ? "100%" : "48%",
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
