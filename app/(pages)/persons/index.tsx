// App.js
import PersonFilter from "@/components/Filter/PersonFilter";
import PersonTable from "@/components/Table/PersonTable";
import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { persons } from "@/constants/persons";
export default function Person() {
  const [filters, setFilters] = useState({
    fullname: "",
    email: "",
    age: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const filteredData = useMemo(() => {
    let data = [...persons];

    (Object.keys(filters) as Array<keyof typeof filters>).forEach((key) => {
      const value = filters[key];
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
    <ScrollView style={styles.container}>
      <PersonFilter filters={filters} onFilterChange={setFilters} />
      <PersonTable
        data={filteredData}
        sortConfig={sortConfig}
        onSort={toggleSort}
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
