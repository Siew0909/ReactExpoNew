import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import TransactionsTable from '@/components/transaction/TransactionsTable'

const list = () => {
  return (
    <ScrollView style={styles.container}>
      <TransactionsTable />
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
});
export default list