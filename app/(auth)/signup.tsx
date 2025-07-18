import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const client_id = 2;
  const client_secret = "irbHZjOxkn2tWNUJbdxFWtsDDZrfOQmEXCY0BXZS";
  const router = useRouter();

  const login = async () => {
    setLoading(true);

    const result = await onLogin!(username, password);

    if (result && result.error) {
      setLoading(false);
    } else {
      setLoading(false);
      router.replace("/dashboard"); // Add this line
    }
  };

  const register = async () => {
    setLoading(true);

    const result = await onRegister!(username, password);
    if (result && result.error) {
      alert(result.msg);
      setLoading(false);
    } else {
      login();
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS !== "web" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Signup</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              style={styles.inputMock}
              placeholder="Username..."
              onChangeText={(text) => setUsername(text)}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              secureTextEntry={true}
              style={styles.inputMock}
              placeholder="Password..."
              onChangeText={(text) => setPassword(text)}
            ></TextInput>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={"red"} />
          ) : (
            <>
              <Button label="Create New Account" theme="primary" onPress={login}/>
              <Link href="/login">Already have account</Link>
            </>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: 400,
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#222",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  inputMock: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    width: "100%",
    paddingLeft: 12
  },
  button: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Signup;
