// app/persons/index.tsx
import PersonFilter from "@/components/Filter/PersonFilter";
import Pagination from "@/components/Table/Pagination";
import PersonTable from "@/components/Table/PersonTable";
import ShowRowsSelector from "@/components/Table/ShowRow";
import { usePersonsQuery } from "@/shared/api/persons";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function PersonList() {
const [filters, setFilters] = useState({
  name: "",
  phone: "",
  email: "",
});

  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiFilters = useMemo(() => {
    return {
      ...filters,
      page: currentPage,
      limit: rowsPerPage,
    };
  }, [filters, currentPage, rowsPerPage]);

  const { data, isLoading, error } = usePersonsQuery(apiFilters);

  const totalPages = data?.pagination?.last_page ?? "";
  const persons =
    data?.data.map((p) => ({
      id: p.user_id ?? p.id,
      name: p.name ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      username: p.username ?? "",
    })) ?? [];

  const getSortedPersons = () => {
    if (!sortConfig.key || !sortConfig.direction) return persons;

    return [...persons].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

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
      <PersonFilter
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1); // reset page on filter change
        }}
      />

      <ShowRowsSelector
        rowsPerPage={rowsPerPage}
        onChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1); // reset page on row count change
        }}
      />

      {error ? (
        <Text style={{ color: "red", textAlign: "center" }}>
          Failed to load persons.
        </Text>
      ) : (
        <PersonTable
          data={getSortedPersons()}
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
