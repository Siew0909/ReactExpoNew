export interface LinkRoute {
  type: "link";
  name: string;
  path: string;
  icon?: string;
  permission: Array<string>;
}

export interface DropdownRoute {
  type: "dropdown";
  name: string;
  permission: Array<string>;
  items: {
    title: string;
    href: string;
  }[];
  icon?: string;
}

export type AppRoute = LinkRoute | DropdownRoute;
export const routes: AppRoute[] = [
  {
    type: "link",
    permission: ["admin", "user", "manager"],
    name: "Dashboard",
    path: "dashboard",
    icon: "dashboard",
  },
  {
    type: "link",
    permission: [],
    name: "Login",
    path: "(auth)/login",
    icon: "login",
  },
  {
    type: "link",
    permission: [],
    name: "Sign Up",
    path: "(auth)/signup",
    icon: "login",
  },
  {
    type: "link",
    permission: ["admin", "manager"],
    name: "Persons",
    path: "(pages)/persons",
    icon: "person",
  },
  {
    type: "dropdown",
    name: "Transaction",
    permission: ["admin", "manager"],
    items: [
      { title: "List", href: "(pages)/transactions/list" },
      { title: "Refund", href: "(pages)/transactions/refund" },
      { title: "Void", href: "(pages)/transactions/void" },
    ],
    icon: "money",
  },
  {
    type: "dropdown",
    name: "Settings",
    permission: ["admin", "manager"],
    items: [
      { title: "Profile", href: "(pages)/profile" },
    ],
    icon: "settings",
  },
];