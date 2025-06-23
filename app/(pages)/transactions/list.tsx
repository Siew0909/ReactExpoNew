// app/transactions/list.tsx
import TransactionFilter from "@/components/Filter/TransactionFilter";
import Pagination from "@/components/Table/Pagination";
import TransactionTable from "@/components/Table/TransactionTable";
import { useTransactionsQuery } from "@/shared/api/transactions";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function TransactionList() {
  const [filters, setFilters] = useState({
    id: "", // maps to `receipt_code`
    msisdn: "",
    customer_name: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiFilters = useMemo(() => {
    return {
      receipt_code: filters.id,
      msisdn: filters.msisdn,
      fullname: filters.customer_name,
      page: currentPage,
      limit: rowsPerPage,
    };
  }, [filters, currentPage, rowsPerPage]);

  const { data = [], isLoading, error } = useTransactionsQuery(apiFilters);

  const toggleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "asc" };
      if (prev.direction === "asc") return { key: null, direction: null };
      return { key, direction: "desc" };
    });
  };

  const totalPages = Math.ceil((data?.length ?? 0) / rowsPerPage); // Adjust if API provides total count

  return (
    <ScrollView style={styles.container}>
      <TransactionFilter
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1); // reset page when filters change
        }}
      />

      <View style={{ marginBottom: 30, justifyContent: "center" }}>
        <Text style={{ marginBottom: 5 }}>Show rows:</Text>
        <Picker
          selectedValue={rowsPerPage}
          style={{ height: 30, width: 100 }}
          onValueChange={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}
        >
          <Picker.Item label="5 rows" value={5} />
          <Picker.Item label="10 rows" value={10} />
          <Picker.Item label="20 rows" value={20} />
          <Picker.Item label="50 rows" value={50} />
        </Picker>
      </View>

      {error ? (
        <Text style={{ color: "red", textAlign: "center" }}>
          Failed to load transactions.
        </Text>
      ) : (
        <TransactionTable
          data={data}
          sortConfig={sortConfig}
          onSort={toggleSort}
        />
      )}

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
    paddingVertical: 20,
  },
});
