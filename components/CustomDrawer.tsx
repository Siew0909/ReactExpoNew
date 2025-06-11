import { routes } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Image, LayoutAnimation, Pressable, Text, View } from "react-native";
export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const { authState } = useAuth();

  const toggleDropdown = (name: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDropdown((prev) => (prev === name ? null : name));
  };
  const canAccess = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    if (!authState?.role) return false; // no role → deny access
    return permissions.includes(authState.role);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: "center", padding: 10 }}>
        <Image
          source={require("@/assets/images/emoji1.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      {routes.map((route, index) => {
        if (!canAccess(route.permission)) return null;

        if (route.type === "link") {
          const cleanPath = route.path.replace(/^\(pages\)\//, "");
          const isActive = pathname === `/${cleanPath}`;
          return (
            <DrawerItem
              key={index}
              label={route.name}
              focused={isActive}
              onPress={() => router.push(`/${route.path}` as any)}
              icon={({ size, color }) =>
                route.icon ? (
                  <MaterialIcons
                    name={route.icon as any}
                    size={size}
                    color={color}
                  />
                ) : null
              }
            />
          );
        }

        if (route.type === "dropdown") {
          return (
            <View key={route.name}>
              <Pressable
                onPress={() => toggleDropdown(route.name)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                }}
              >
                {route.icon && (
                  <MaterialIcons
                    name={route.icon as any}
                    size={24}
                    style={{ marginRight: 10 }}
                  />
                )}
                <Text style={{ fontSize: 16, flex: 1 }}>{route.name}</Text>
                <MaterialIcons
                  name={
                    expandedDropdown === route.name
                      ? "expand-less"
                      : "expand-more"
                  }
                  size={24}
                />
              </Pressable>

              {expandedDropdown === route.name &&
                route.items.map((item, i) => {
                  const isActive = pathname.includes(item.href);
                  return (
                    <DrawerItem
                      key={i}
                      label={item.title}
                      focused={isActive}
                      style={{ paddingLeft: 32 }}
                      onPress={() => router.push(`/${item.href}` as any)}
                    />
                  );
                })}
            </View>
          );
        }

        return null;
      })}
    </DrawerContentScrollView>
  );
}
