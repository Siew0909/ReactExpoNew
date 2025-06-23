// components/Pagination.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <View style={styles.pagination}>
      <Pressable
        style={[styles.pageButton, currentPage === 1 && styles.disabled]}
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <Text style={styles.pageText}>Prev</Text>
      </Pressable>

      <Text style={styles.pageInfo}>
        Page {totalPages == 0 ? '' : currentPage} / {totalPages}
      </Text>

      <Pressable
        style={[
          styles.pageButton,
          (currentPage === totalPages || totalPages === 0) && styles.disabled,
        ]}
        disabled={currentPage === totalPages || totalPages === 0}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <Text style={styles.pageText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  pageButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#007aff",
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
