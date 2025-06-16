import TransactionFilter from "@/components/Filter/TransactionFilter";
import TransactionTable from "@/components/Table/TransactionTable";
import { transactions } from "@/constants/transactions";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function TransactionList() {
  const [filters, setFilters] = useState({
    trx_id: "",
    transaction_date: "",
    customer_name: "",
    number_id: "",
    msisdn: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const filteredData = useMemo(() => {
    let data = [...transactions];

    (Object.keys(filters) as Array<keyof typeof filters>).forEach((key) => {
      let value = filters[key];
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

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "asc" };
      return { key: null, direction: null };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TransactionFilter filters={filters} onFilterChange={setFilters} />
      <TransactionTable
        data={filteredData}
        sortConfig={sortConfig}
        onSort={toggleSort}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalRows={filteredData.length}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
});
