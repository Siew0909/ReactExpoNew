import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  Card,
  DataTable,
  Divider,
  IconButton,
  Surface,
  Text,
} from "react-native-paper";

/**
 * Sample data for column and using a customize cell via Chip
 *
 * ### Usage
 * ```js
 *   {
 *     key: "status",
 *     title: "Status",
 *     sortable: true,
 *     cellStyle: { flex: 1.5, justifyContent: "center" },
 *     headerStyle: { flex: 1.5, justifyContent: "center" },
 *     render: (value: string, item: DataItem) => {
 *       return (
 *         <Chip>
 *           {value}
 *         </Chip>
 *       );
 *     },
 * ```
 */
export interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  cellStyle?: any;
  headerStyle?: any;
  textStyle?: any;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface DataItem {
  id: string;
  [key: string]: any;
}

interface ExpandableDataTableProps {
  data?: DataItem[];
  columns?: Column[];
  expandedContent?: (item: DataItem) => React.ReactNode;
  isLoading: boolean;
  defaultSortColumn?: string | null;
  defaultSortDirection?: "ascending" | "descending";
  tableStyle?: any;
  rowStyle?: (item: DataItem) => StyleProp<ViewStyle>;
  expandedRowStyle?: any;
  onRowPress?: (item: DataItem) => void;
  header?: React.ReactNode;
}

/**
 * ExpandableDataTable is a component that allows you to create a table with expandable rows.
 *
 * ### Usage
 * ```js
 *     <ExpandableTable
 *       data={data}
 *       columns={columns}
 *       expandedContent={renderExpandedContent}
 *       defaultSortColumn="name"
 *       defaultSortDirection="ascending"
 *       onRowPress={handleRowPress} // default is toggle expandable row
 *     />
 * ```
 */
const ExpandableDataTable: React.FC<ExpandableDataTableProps> = ({
  data = [],
  columns = [],
  expandedContent,
  isLoading,
  defaultSortColumn = null,
  defaultSortDirection = "ascending",
  tableStyle = {},
  rowStyle,
  expandedRowStyle = {},
  onRowPress = null,
  header,
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set<string>());
  const [sortAscending, setSortAscending] = useState(
    defaultSortDirection === "ascending"
  );
  const [sortedColumn, setSortedColumn] = useState<string>(
    defaultSortColumn || columns[0]?.key || ""
  );

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (column: string) => {
    if (sortedColumn === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortedColumn(column);
      setSortAscending(true);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortedColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortedColumn];
      const bValue = b[sortedColumn];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortAscending ? aValue - bValue : bValue - aValue;
      }

      // Fallback to string comparison
      return sortAscending
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortedColumn, sortAscending]);

  const isExpanded = (id: string) => expandedRows.has(id);

  const renderCellContent = (item: DataItem, column: Column) => {
    const value = item[column.key];

    // Custom render function
    if (column.render) {
      return column.render(value, item);
    }

    return <Text style={[styles.cellText, column.textStyle]}>{value}</Text>;
  };

  const renderExpandedContent = (item: DataItem) => {
    if (!isExpanded(item.id) || !expandedContent) return null;

    return (
      <Surface
        style={[styles.expandedContainer, expandedRowStyle]}
        elevation={1}
      >
        <Card.Content>{expandedContent(item)}</Card.Content>
      </Surface>
    );
  };

  const handleRowPress = (item: DataItem) => {
    if (onRowPress) {
      onRowPress(item);
    }
    toggleRow(item.id);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Surface style={[styles.tableContainer, tableStyle]} elevation={2}>
        {header ? (
          <View>
            {header}
            <Divider />
          </View>
        ) : null}
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" />
            <Text>{isLoading}</Text>
          </View>
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.expandColumn}>
                <Text style={{ color: "transparent" }}> </Text>
              </DataTable.Title>
              {columns.map((column) => (
                <DataTable.Title
                  key={column.key}
                  sortDirection={
                    sortedColumn === column.key
                      ? sortAscending
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  onPress={
                    column.sortable !== false
                      ? () => handleSort(column.key)
                      : undefined
                  }
                  style={[styles.defaultColumn, column.headerStyle]}
                >
                  {column.title}
                </DataTable.Title>
              ))}
            </DataTable.Header>

            {sortedData.map((item, index) => (
              <View key={item.id || index}>
                <DataTable.Row
                  onPress={() => handleRowPress(item)}
                  style={[
                    styles.dataRow,
                    isExpanded(item.id) && styles.expandedRow,
                    rowStyle ? rowStyle(item) : null,
                  ]}
                >
                  <DataTable.Cell style={styles.expandColumn}>
                    <IconButton
                      icon={
                        isExpanded(item.id) ? "chevron-down" : "chevron-right"
                      }
                      size={20}
                      onPress={() => toggleRow(item.id)}
                    />
                  </DataTable.Cell>
                  {columns.map((column) => (
                    <DataTable.Cell
                      key={column.key}
                      style={[styles.defaultColumn, column.cellStyle]}
                    >
                      {renderCellContent(item, column)}
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>

                {renderExpandedContent(item)}
              </View>
            ))}
          </DataTable>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  expandColumn: {
    flex: 0.8,
    justifyContent: "center",
  },
  defaultColumn: {
    flex: 1,
  },
  dataRow: {
    minHeight: 60,
  },
  expandedRow: {
    backgroundColor: "#f8f9fa",
  },
  cellText: {
    fontSize: 14,
    color: "#333",
  },
  expandedContainer: {
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: "#f8f9fa",
    borderRadius: 0,
  },
});

export default ExpandableDataTable;
