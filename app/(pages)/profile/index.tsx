// ProfileScreen.tsx
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from "react-native";

const ProfileScreen = () => {
    const router = useRouter(); // ⬅️ Hook to navigate
  const user = {
    name: "Siew Wei Chuen",
    email: "siew@example.com",
    bio: "Tech-savvy problem solver & fitness enthusiast 💪",
    avatar: "https://i.pravatar.cc/150?img=12", // Replace with real avatar URL
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      <Pressable style={styles.button} onPress={() => router.push("/profile/edit")}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileScreen;
