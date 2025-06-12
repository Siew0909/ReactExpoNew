// Define the Person interface
export interface Person {
  id: number;
  fullname: string;
  email: string;
  age: number;
  contact_no: string;
  username: string;
}

// Define the LoginAcc interface with reference to Person's id
export interface LoginAcc {
  username: string;
  password: string;
  personId: number; // This acts like PersonWithAccount
  roles: string[];
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
}

// Dummy people data
export const persons: Person[] = [
  {
    id: 1,
    fullname: "Alice",
    email: "alice@example.com",
    age: 25,
    contact_no: "6580800808",
    username: "alice123",
  },
  {
    id: 2,
    fullname: "Bob",
    email: "bob@example.com",
    age: 30,
    contact_no: "6580800888",
    username: "alice123",
  },
  {
    id: 3,
    fullname: "Charlie",
    email: "charlie@example.com",
    age: 22,
    contact_no: "6580808888",
    username: "alice123",
  },
  {
    id: 4,
    fullname: "David",
    email: "david@example.com",
    age: 28,
    contact_no: "6580809009",
    username: "alice123",
  },
  {
    id: 5,
    fullname: "Eva",
    email: "eva@example.com",
    age: 26,
    contact_no: "6580800909",
    username: "alice123",
  },

];

// Dummy login accounts, referencing Person IDs
export const loginAccounts: LoginAcc[] = [
  {
    username: "alicej",
    password: "password123",
    personId: 1,
    roles: [Role.ADMIN, Role.USER],
  },
  {
    username: "bobsmith",
    password: "password456",
    personId: 2,
    roles: [Role.MANAGER],
  },
];
