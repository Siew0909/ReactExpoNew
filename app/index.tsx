import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator, View } from "react-native";

const Landing = () => {
  const router = useRouter();
  const { authState } = useAuth();

  useEffect(() => {
    if (authState?.authenticated === null) return; // Still loading

    if (authState?.authenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [authState]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Landing;