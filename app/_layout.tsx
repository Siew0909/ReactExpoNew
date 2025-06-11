import Button from "@/components/Button";
import CustomDrawerContent from "@/components/CustomDrawer";
import TopNav from "@/components/TopNav";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { getPermissionsForPath } from "@/utils/permissionRoutes";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { routes } from "@/constants/routes";

export default function Layout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InnerLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
const getRouteNameFromPath = (pathname: string): string => {
  // Remove leading slash
  const cleanPath = pathname.startsWith("/") ? pathname.substring(1) : pathname;

  // Try to find matching route
  const match = routes.find((route) => {
    if (route.type === "link") {
      return route.path.replace("(auth)/", "").replace("(pages)/", "") === cleanPath;
    } else if (route.type === "dropdown") {
      // Check dropdown items
      return route.items.some((item) =>
        item.href.replace("(pages)/", "") === cleanPath
      );
    }
    return false;
  });

  return match ? match.name : "";
};

function InnerLayout() {
  const { authState, onLogout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const segments = useSegments();
const currentPageName = getRouteNameFromPath(pathname);

  useEffect(() => {
    if (authState?.authenticated === null) {
      return;
    }

    const inAuthGroup = segments[0] === "(pages)";

    if (
      (authState?.authenticated === null ||
        authState?.authenticated === false) &&
      inAuthGroup
    ) {
      router.replace("/login");
    } else if (authState?.authenticated === true && pathname === "/login") {
      router.replace("/dashboard");
    }

    if (authState?.authenticated === true) {
      const allowedRoles = getPermissionsForPath(pathname);
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(authState.role!)) {
          alert(
            "Access Denied! You do not have permission to access this page."
          );
          router.replace("/dashboard");
        }
      }
    }
  }, [authState, pathname, segments]);

  const dimensions = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMobileWidth = dimensions.width < 768;
  // Ensure that we always render a navigator to avoid the error
  if (authState?.authenticated === null) {
    // Loading state: render minimal layout with Slot to satisfy the router
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isWeb && !isMobileWidth) {
    return (
      <>
        <TopNav />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </>
    );
  } else {
    return (
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveTintColor: "red",
          drawerHideStatusBarOnOpen: true,
          title: currentPageName || "Page",
          headerRight: () => {
            return authState?.authenticated === true ? (
              <Button label="Sign Out" onPress={onLogout} />
            ) : (
              ""
            );
          },
        }}
      ></Drawer>
    );
  }
}
