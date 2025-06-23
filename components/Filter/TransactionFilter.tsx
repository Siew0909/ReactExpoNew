import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type TransactionFilterProps = {
  filters: {
    id?: string;
    transaction_date?: string;
    msisdn?: string;
  };
  onFilterChange: (filters: { [key: string]: string | undefined }) => void;
};

const filterKeys = ["id", "transaction_date", "msisdn"];

export default function TransactionFilter({
  filters,
  onFilterChange,
}: TransactionFilterProps) {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <View style={styles.filterContainer}>
      {filterKeys.map((key) => (
        <View key={key} style={styles.filterItem}>
          <TextInput
            style={styles.input}
            placeholder={key === 'id' ? 'Transaction Code' :key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
            value={filters[key]}
            onChangeText={(text) => handleChange(key, text)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  filterItem: {
    width: '23%',
    minWidth: 150,
    marginRight: '2%',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
