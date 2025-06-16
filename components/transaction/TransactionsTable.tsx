import ExpandableTable, {
  Column,
  DataItem,
} from "@/components/ExpandableTable";
import VerticalDivider from "@/components/VerticalDivider";
import {
  TransactionsFilter,
  useTransactionsQuery,
} from "@/shared/api/transactions";
import { useDebounce } from "@/shared/utils/useDebounce";

import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Divider, TextInput, useTheme } from "react-native-paper";

export default function TransactionsTable() {
  const { colors } = useTheme();
  //   const filters = { receipt_code: "130525-NURLBC5623" };
  const [filters, setFilters] = useState<TransactionsFilter>({
    searchTerm: "",
    customer_type: "",
    transaction_type: "",
    product: "",
    receipt_code: "",
    msisdn: "",
    fullname: "",
    number_id: "",
    package_name: "",
    page: 1,
    limit: 20,
  });
  const debouncedMsisdn = useDebounce(filters.msisdn, 500);
  const debouncedFullname = useDebounce(filters.fullname, 500);
  const debouncedNumberId = useDebounce(filters.number_id, 500);
  const debouncedPackageName = useDebounce(filters.package_name, 500);
  const debouncedReceiptCode = useDebounce(filters.receipt_code, 500);

  // Combine debounced search term with other instant filters for the API call
  const apiFilters = useMemo(
    () => ({
      ...filters,
      msisdn: debouncedMsisdn,
      fullname: debouncedFullname,
      number_id: debouncedNumberId,
      package_name: debouncedPackageName,
      receipt_code: debouncedReceiptCode, // Override with debounced value
    }),
    [
      filters,
      debouncedMsisdn,
      debouncedFullname,
      debouncedNumberId,
      debouncedPackageName,
      debouncedReceiptCode,
    ]
  ); // Depend on both `filters` and debounced values
  const { data: transactionsData, isLoading } =
    useTransactionsQuery(apiFilters);

  const columns: Column[] = [
    {
      key: "id",
      title: "Id",
      sortable: true,
      cellStyle: { flex: 2, justifyContent: "center" },
      headerStyle: { flex: 2, justifyContent: "center" },
      textStyle: { fontWeight: "600", fontSize: 16, color: "#333" },
    },
    {
      key: "transaction_date",
      title: "Date",
      sortable: true,
      cellStyle: { flex: 2.5, justifyContent: "center" },
      headerStyle: { flex: 2.5, justifyContent: "center" },
      textStyle: { fontSize: 14, color: "#666" },
    },
    {
      key: "total",
      title: "Amount",
      sortable: true,
      cellStyle: { flex: 2, justifyContent: "center" },
      headerStyle: { flex: 2, justifyContent: "center" },
      textStyle: { fontWeight: "600", fontSize: 16, color: "#333" },
    },
    {
      key: "customer.name",
      title: "Name",
      sortable: true,
      cellStyle: { flex: 1.5, justifyContent: "center" },
      headerStyle: { flex: 1.5, justifyContent: "center" },
      render: (value: any, item: DataItem) => {
        return (
          <Link href={`/customer/${item.customer.slug}`} asChild>
            <Pressable>
              <Text
                style={{
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                {item.customer.fullname}
              </Text>
            </Pressable>
          </Link>
        );
      },
    },
  ];

  const renderExpandedContent = (item: DataItem) => (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.expandedTitle}>Customer Details</Text>
        <Divider style={styles.divider} />
        <View style={styles.detailsGrid}>
          <View style={styles.detailColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{item.customer.fullname}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Id Number</Text>
              <Text style={styles.detailValue}>{item.customer.number_id}</Text>
            </View>
          </View>
        </View>
      </View>
      <VerticalDivider />
      <View style={{ flex: 1 }}>
        <Text style={styles.expandedTitle}>Transaction Details</Text>
        <Divider style={styles.divider} />
        <View style={styles.detailColumn}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Mobile Number</Text>
            <Text style={[styles.detailValue, styles.addressText]}>
              {item.items[0].phone_number}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={[styles.detailValue, styles.salaryText]}>
              $ {item.items[0].price}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const handleRowPress = (item: DataItem) => {
    console.log("Row pressed:", item.name);
  };
  const getConditionalRowStyle = (item: DataItem): StyleProp<ViewStyle> => {
    if (item.is_renewal) {
      return { backgroundColor: colors.errorContainer, opacity: 0.7 };
    }
    return null;
  };

  const handleFilterChange = (
    filterName: keyof TransactionsFilter,
    value: any
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
      // You can add logic here to reset other filters if needed, e.g.:
      // ...(filterName === 'status' && { page: 1 }), // Reset page if status changes
    }));
  };
  return (
    <View style={styles.container}>
      <ExpandableTable
        data={transactionsData}
        columns={columns}
        isLoading={isLoading}
        expandedContent={renderExpandedContent}
        rowStyle={getConditionalRowStyle}
        defaultSortColumn="name"
        defaultSortDirection="ascending"
        onRowPress={handleRowPress}
        header={
          <View style={styles.filtersContainer}>
            <TextInput
              label="Transaction Code"
              placeholder="Enter the transaction code"
              value={filters.receipt_code}
              onChangeText={(text) => handleFilterChange("receipt_code", text)}
              style={[
                { width: Platform.OS === "web" ? "25%" : "50%" },
                styles.filterItem,
              ]}
              mode="outlined"
              dense
            />
            <TextInput
              label="MSISDN"
              placeholder="Enter the mobile number"
              value={filters.msisdn}
              onChangeText={(text) => handleFilterChange("msisdn", text)}
              style={[
                { width: Platform.OS === "web" ? "20%" : "45%" },
                styles.filterItem,
              ]}
              dense
              mode="outlined"
            />
            <TextInput
              label="Customer Name"
              placeholder="Enter the customer fullname"
              value={filters.fullname}
              onChangeText={(text) => handleFilterChange("fullname", text)}
              style={[
                { width: Platform.OS === "web" ? "20%" : "50%" },
                styles.filterItem,
              ]}
              dense
              mode="outlined"
            />

            <TextInput
              label="Id Number"
              placeholder="Enter the customer ID"
              value={filters.number_id}
              onChangeText={(text) => handleFilterChange("number_id", text)}
              style={[
                { width: Platform.OS === "web" ? "20%" : "45%" },
                styles.filterItem,
              ]}
              dense
              mode="outlined"
            />
            <TextInput
              label="Package Name"
              placeholder="Enter the package name"
              value={filters.package_name}
              onChangeText={(text) => handleFilterChange("package_name", text)}
              style={[
                { width: Platform.OS === "web" ? "20%" : "45%" },
                styles.filterItem,
              ]}
              dense
              mode="outlined"
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
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
  expandedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    gap: 20,
  },
  detailColumn: {
    flex: 1,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: "#6c757d",
    lineHeight: 20,
  },
  addressText: {
    lineHeight: 18,
  },
  salaryText: {
    fontWeight: "700",
    color: "#28a745",
    fontSize: 16,
  },
  filterItem: {
    marginVertical: 5, // Vertical spacing between rows
    marginHorizontal: "1%", // Horizontal spacing between items
    backgroundColor: "white",
  },
});
