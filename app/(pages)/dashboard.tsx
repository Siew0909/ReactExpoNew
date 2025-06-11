import { Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontSize: 100, fontWeight: 500}}>Dashboard Page</Text>
    </View>
  );
}
