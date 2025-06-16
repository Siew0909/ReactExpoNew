import { TransactionsFilter } from "@/shared/api/transactions";
import Feather from "@expo/vector-icons/Feather";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { FAB, Modal, Portal, TextInput } from "react-native-paper";

interface TransactionFilterFABProps {
  filters: TransactionsFilter;
  handleFilterChange?: (
    filterName: keyof TransactionsFilter,
    value: any
  ) => void;
}

const TransactionFilterFAB: React.FC<TransactionFilterFABProps> = ({
  filters = {},
  handleFilterChange = null,
}) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <FAB
        icon={({ color, size }) => (
          <Feather name="search" size={size} color={color} />
        )}
        style={styles.fab}
        onPress={showModal}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <View style={styles.filtersContainer}>
            <TextInput
              label="Transaction Code"
              placeholder="Enter the transaction code"
              value={filters.receipt_code}
              onChangeText={(text) =>
                handleFilterChange?.("receipt_code", text)
              }
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
              onChangeText={(text) => handleFilterChange?.("msisdn", text)}
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
              onChangeText={(text) => handleFilterChange?.("fullname", text)}
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
              onChangeText={(text) => handleFilterChange?.("number_id", text)}
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
              onChangeText={(text) =>
                handleFilterChange?.("package_name", text)
              }
              style={[
                { width: Platform.OS === "web" ? "20%" : "45%" },
                styles.filterItem,
              ]}
              dense
              mode="outlined"
            />
          </View>
        </Modal>
      </Portal>
    </>
  );
};
const styles = StyleSheet.create({
  containerStyle: { backgroundColor: "white", padding: 20 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 8,
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
  filterItem: {
    marginVertical: 5, // Vertical spacing between rows
    marginHorizontal: "1%", // Horizontal spacing between items
    backgroundColor: "white",
  },
});

export default TransactionFilterFAB;
