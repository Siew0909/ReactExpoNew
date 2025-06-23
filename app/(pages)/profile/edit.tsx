// app/(pages)/profile/edit.tsx
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const EditProfileScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=12");
  const [name, setName] = useState("0123456789"); // Placeholder for contact number
  const [email, setEmail] = useState("siew@example.com");
  const [bio, setBio] = useState(
    "Tech-savvy problem solver & fitness enthusiast 💪"
  );

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied for image picker");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    console.log("Updated:", { avatar, name, email, bio });
    router.back();
  };

  const cardWidth = width > 600 ? width * 0.6 : width * 0.9; // mimic col-4 on web

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { width: cardWidth }]}>
        <Pressable onPress={handlePickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </Pressable>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Contact No</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 8,
  },
  avatarHint: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EditProfileScreen;
