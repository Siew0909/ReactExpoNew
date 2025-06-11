// TopNav.tsx
import { routes } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Dropdown from "./Dropdown";

export default function TopNav() {
  const router = useRouter();
  const { authState, onLogout } = useAuth();
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // call logout
    }
    router.push("/login"); // redirect to login
  };
  const canAccess = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    if (!authState?.role) return false; // no role → deny access
    return permissions.includes(authState.role);
  };
  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>MyApp</Text>

      <View style={styles.navLinksContainer}>
        {routes.map((route, index) => {
          if (
            authState?.authenticated &&
            (route.name === "Login" || route.name === "Sign Up")
          ) {
            return null;
          }

          if (!canAccess(route.permission)) return null;

          if (route.type === "dropdown") {
            return (
              <Dropdown
                key={`dropdown-${index}`}
                label={route.name}
                items={route.items}
                labelStyle={styles.link}
              />
            );
          }

          return (
            <Pressable
              key={route.path}
              onPress={() =>
                router.push(route.path === "index" ? "/" : `/${route.path}`)
              }
              style={{ marginHorizontal: 10 }}
            >
              <Text style={styles.link}>{route.name}</Text>
            </Pressable>
          );
        })}
        {authState?.authenticated && (
          <Pressable onPress={handleLogout} style={{ marginHorizontal: 10 }}>
            <Text style={styles.link}>Logout</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 100,
  },
  logo: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
  hovered: {},
  navLinksContainer: {
    flexDirection: "row",
    marginLeft: "auto", // Push to the right
    gap: 20,
  },
  link: {
    fontSize: 16,
    fontWeight: "500",
  },
});
