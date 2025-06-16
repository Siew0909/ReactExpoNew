import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type PaginationProps = {
  currentPage: number;
  totalCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions?: number[];
};

export default function Pagination({
  currentPage,
  totalCount,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <View style={styles.pagination}>
      {/* Page controls */}
      <Pressable
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={[
          styles.pageButton,
          currentPage === 1 && styles.disabledButton,
        ]}
      >
        <Text style={styles.pageButtonText}>Prev</Text>
      </Pressable>

      <Text style={styles.pageNumber}>
        Page {currentPage} of {totalPages}
      </Text>

      <Pressable
        disabled={currentPage >= totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        style={[
          styles.pageButton,
          currentPage >= totalPages && styles.disabledButton,
        ]}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </Pressable>

      {/* Rows per page */}
      <View style={styles.dropdownWrapper}>
        <Text style={{ marginRight: 5 }}>Rows:</Text>
        {rowsPerPageOptions.map((size) => (
          <Pressable
            key={size}
            onPress={() => {
              onRowsPerPageChange(size);
              onPageChange(1); // reset to page 1
            }}
            style={[
              styles.dropdownItem,
              rowsPerPage === size && styles.selectedDropdownItem,
            ]}
          >
            <Text
              style={
                rowsPerPage === size
                  ? styles.selectedDropdownText
                  : undefined
              }
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    flexWrap: "wrap",
    rowGap: 8,
  },
  pageButton: {
    padding: 8,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#eee",
  },
  pageButtonText: {
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: 16,
  },
  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  dropdownItem: {
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  selectedDropdownItem: {
    backgroundColor: "#2196F3",
  },
  selectedDropdownText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
