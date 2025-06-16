import {
  TransactionsFilter,
  useTransactionsQuery,
} from "@/shared/api/transactions";
import { useDebounce } from "@/shared/utils/useDebounce";

import TransactionFilterFAB from "@/components/transaction/TransactionFilterFAB";
import * as Clipboard from "expo-clipboard";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function TransactionsList() {
  const { colors } = useTheme();
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
    <>
      {isLoading ? (
        <ActivityIndicator style={{ marginVertical: 5 }} size="large" />
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View>
              {transactionsData
                ? transactionsData.map((transaction) => (
                    <Card
                      key={transaction.id}
                      style={styles.employeeCard}
                      // onPress={() => handleEditEmployee(transaction.id)}
                      mode="outlined"
                    >
                      <Card.Content>
                        <Text
                          style={styles.cardTitle}
                          onLongPress={() => {
                            Clipboard.setStringAsync(transaction.id);
                            if (Platform.OS === "android") {
                              ToastAndroid.show(
                                "Copied ID to clipboard",
                                ToastAndroid.SHORT
                              );
                            } else {
                              Alert.alert("Copied", "ID copied to clipboard");
                            }
                          }}
                        >
                          {transaction.id}
                        </Text>
                        <Text style={styles.cardDetail}>
                          Date: {transaction.transaction_date}
                        </Text>
                        <Text style={styles.cardDetail}>
                          MSISDN: {transaction.selected_msisdn}
                        </Text>
                        <Text style={styles.cardDetail}>
                          Customer Name: {transaction.customer.fullname}
                        </Text>
                        <Text style={styles.cardDetail}>
                          Total: ${transaction.total}
                        </Text>
                        {transaction.items.map((item, index) => (
                          <Text key={index} style={styles.cardDetail}>
                            Package: {item.package.name}
                            Phone Number: {item.phone_number}
                          </Text>
                        ))}
                      </Card.Content>
                      <Card.Actions>
                        <Button>View/Edit</Button>
                      </Card.Actions>
                    </Card>
                  ))
                : null}
            </View>
          </View>
        </ScrollView>
      )}
      <TransactionFilterFAB
        filters={filters}
        handleFilterChange={handleFilterChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
  },
  employeeCard: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 3,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 8,
  },
});
