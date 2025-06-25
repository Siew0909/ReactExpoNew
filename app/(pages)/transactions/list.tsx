// app/transactions/list.tsx
import TransactionFilter from "@/components/Filter/TransactionFilter";
import Pagination from "@/components/Table/Pagination";
import ShowRowsSelector from "@/components/Table/ShowRow";
import TransactionTable from "@/components/Table/TransactionTable";
import { useTransactionsQuery } from "@/shared/api/transactions";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

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

  const { data, isLoading, error } = useTransactionsQuery(apiFilters);

  // Transactions array:
  const transactions = data?.data ?? [];

  // Pagination info:
  const totalPages = data?.pagination?.last_page ?? '';
  const getSortedTransactions = () => {
    if (!transactions || !sortConfig.key || !sortConfig.direction) {
      return transactions;
  }

  const sorted = [...transactions].sort((a, b) => {
    const key = sortConfig.key;
    const valA = a[key];
    const valB = b[key];

     // Handle null or undefined
    const isANull = valA === null || valA === undefined;
    const isBNull = valB === null || valB === undefined;

    if (isANull && !isBNull) return sortConfig.direction === "asc" ? -1 : 1;
    if (!isANull && isBNull) return sortConfig.direction === "asc" ? 1 : -1;
    if (isANull && isBNull) return 0;

    if (typeof valA === "string" && typeof valB === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }

    return 0;
  });

  return sorted;
};

  const toggleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "asc" };
      if (prev.direction === "asc") return { key: null, direction: null };
      return { key, direction: "desc" };
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TransactionFilter
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1); // reset page when filters change
        }}
      />

      <ShowRowsSelector
        rowsPerPage={rowsPerPage}
        onChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
      />

      {error ? (
        <Text style={{ color: "red", textAlign: "center" }}>
          Failed to load transactions.
        </Text>
      ) : (
        <TransactionTable
          data={getSortedTransactions()}
          sortConfig={sortConfig}
          onSort={toggleSort}
          isLoading={isLoading}
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
  scrollContent: {
    paddingBottom: 80, // ensures bottom spacing for pagination on small screens
  },
});