// components/TableSection.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';

type Transaction = {
  id: number | string;
  fullname: string;
  email: string;
  age: number;
};

type SortConfig = {
  key: keyof Transaction;
  direction: 'asc' | 'desc' | '';
};
type TransactionTableProps = {
  data: Transaction[];
  sortConfig: SortConfig;
  onSort: (key: keyof Transaction) => void;
};

export default function TransactionTable({ data, sortConfig, onSort }: TransactionTableProps) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'transaction_code', label: 'Transaction Code' },
    { key: 'msisdn', label: 'MSISDN' },
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'number_id', label: 'Number ID' },
    { key: 'package_name', label: 'Package Name' },
  ];

  const renderHeader = () => (
    <View style={styles.row}>
      {columns.map((col) => {
        const isSorted = sortConfig.key === col.key;
        let sortSymbol = '';
        if (isSorted) {
          sortSymbol = sortConfig.direction === 'asc' ? ' ↑' : sortConfig.direction === 'desc' ? ' ↓' : '';
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
    <View style={styles.table}>
      {renderHeader()}
      <FlatList data={data} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  table: {
    minWidth: screenWidth,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 12,
  },
  header: {
    backgroundColor: '#e0e0e0',
  },
  headerText: {
    fontWeight: 'bold',
  },
});
