// components/FilterSection.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function TransactionFilter() {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Transaction Code" style={styles.input} />
      <TextInput placeholder="MSISDN" style={styles.input} />
      <TextInput placeholder="Customer Name" style={styles.input} />
      <TextInput placeholder="Id Number" style={styles.input} />
      <TextInput placeholder="Package Name" style={[styles.input]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 5, 
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  input: {
    width: '19%', 
    margin: 5,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 8,
  },
  filtersContainer: {
    flexDirection: "row", // Arrange children in a row
    flexWrap: "wrap", // Allow children to wrap to the next line
    justifyContent: "flex-start", // Start children from the left
    // alignItems: "flex-start", // Align items at the start of their cross axis (top)
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
  },
  filterItem: {
    marginVertical: 5, // Vertical spacing between rows
    marginHorizontal: "1%", // Horizontal spacing between items
    backgroundColor: "white",
  },
});