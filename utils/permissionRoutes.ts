// utils/getPermissionsForPath.ts
import { routes } from "@/constants/routes";

// Normalize paths: remove leading "/", and "(pages)/" or "(auth)/"
function normalizePath(path: string): string {
  return path.replace(/^\/|\(pages\)\//g, "").replace(/\(auth\)\//g, "");
}

export function getPermissionsForPath(pathname: string): string[] | null {
  const currentPath = normalizePath(pathname);

  for (const route of routes) {
    if (route.type === "link") {
      const routePath = normalizePath(route.path);
      if (currentPath.startsWith(routePath)) {
        return route.permission;
      }
    } else if (route.type === "dropdown") {
      for (const item of route.items) {
        const itemPath = normalizePath(item.href);
        if (currentPath.startsWith(itemPath)) {
          return route.permission;
        }
      }
    }
  }

  return null; // Path not found in routes
}
