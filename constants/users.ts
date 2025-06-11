// constants/users.ts

export interface DummyUser {
  username: string;
  password: string;
  roles: string[];
}

export const users: DummyUser[] = [
  {
    username: "admin",
    password: "admin123",
    roles: ["admin", "user"],
  },
  {
    username: "user1",
    password: "user123",
    roles: ["user"],
  },
  {
    username: "manager",
    password: "manager123",
    roles: ["manager", "user"],
  },
];
