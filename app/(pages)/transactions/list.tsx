// app/transaction/index.tsx
import TransactionFilter from "@/components/Filter/TransactionFilter";
import Pagination from "@/components/Table/Pagination";
import TransactionTable from "@/components/Table/TransactionTable";
import { transactions } from "@/constants/transactions";
import React, { useMemo, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function TransactionList() {
  const [filters, setFilters] = useState({
    trx_id: "",
    msisdn: "",
    customer_name: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    let data = [...transactions];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        data = data.filter((item) =>
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    if (sortConfig.key && sortConfig.direction) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [filters, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "asc" };
      if (prev.direction === "asc") return { key: null, direction: null };
      return { key, direction: "desc" };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginVertical: 10 }}>
        <Text style={{ marginBottom: 5 }}>Show rows:</Text>
        <Picker
          selectedValue={rowsPerPage}
          style={{ height: 40, width: 150 }}
          onValueChange={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1); // Reset to first page when rows per page changes
          }}
        >
          <Picker.Item label="5 rows" value={5} />
          <Picker.Item label="10 rows" value={10} />
          <Picker.Item label="20 rows" value={20} />
          <Picker.Item label="50 rows" value={50} />
        </Picker>
      </View>

      <TransactionFilter
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
      />
      <TransactionTable
        data={paginatedData}
        sortConfig={sortConfig}
        onSort={toggleSort}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
});
