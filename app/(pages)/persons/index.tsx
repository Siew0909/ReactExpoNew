// App.js
import PersonFilter from "@/components/Filter/PersonFilter";
import Pagination from "@/components/Table/Pagination";
import PersonTable from "@/components/Table/PersonTable";
import { persons } from "@/constants/persons";
import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Person() {
  const [filters, setFilters] = useState({
    fullname: "",
    email: "",
    age: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    let data = [...persons];

    (Object.keys(filters) as Array<keyof typeof filters>).forEach((key) => {
      let value = filters[key];
      if (value) {
        if (key === "contact_no" && !value.startsWith("65")) {
          value = "65" + value;
        }

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
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, rowsPerPage]);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Toggle sort order (default → desc → asc → default)
  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "desc" };
      if (prev.direction === "desc") return { key, direction: "asc" };
      if (prev.direction === "asc") return { key: null, direction: null };
      return { key, direction: "desc" };
    });
  };

  return (
    <View style={styles.container}>
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

      <PersonFilter filters={filters} onFilterChange={setFilters} />
      <PersonTable
        data={paginatedData}
        sortConfig={sortConfig}
        onSort={toggleSort}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
});
