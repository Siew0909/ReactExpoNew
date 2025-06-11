import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: `Page ${id}` }} />
      <Text> Welcome to ID no: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Page;
