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
{
  id: 6,
  fullname: "Fiona",
  email: "fiona@example.com",
  age: 27,
  contact_no: "6580800011",
  username: "fiona27",
},
{
  id: 7,
  fullname: "George",
  email: "george@example.com",
  age: 35,
  contact_no: "6580800022",
  username: "georgeg",
},
{
  id: 8,
  fullname: "Hannah",
  email: "hannah@example.com",
  age: 24,
  contact_no: "6580800033",
  username: "hannah24",
},
{
  id: 9,
  fullname: "Ian",
  email: "ian@example.com",
  age: 31,
  contact_no: "6580800044",
  username: "ian031",
},
{
  id: 10,
  fullname: "Jane",
  email: "jane@example.com",
  age: 29,
  contact_no: "6580800055",
  username: "janeDoe",
},
{
  id: 11,
  fullname: "Kevin",
  email: "kevin@example.com",
  age: 26,
  contact_no: "6580800066",
  username: "kevk26",
},
{
  id: 12,
  fullname: "Laura",
  email: "laura@example.com",
  age: 23,
  contact_no: "6580800077",
  username: "lauragirl",
},
{
  id: 13,
  fullname: "Mike",
  email: "mike@example.com",
  age: 34,
  contact_no: "6580800088",
  username: "mikey",
},
{
  id: 14,
  fullname: "Nina",
  email: "nina@example.com",
  age: 30,
  contact_no: "6580800099",
  username: "nina_n",
},
{
  id: 15,
  fullname: "Oscar",
  email: "oscar@example.com",
  age: 28,
  contact_no: "6580800101",
  username: "oscman",
},
{
  id: 16,
  fullname: "Paula",
  email: "paula@example.com",
  age: 32,
  contact_no: "6580800112",
  username: "paulapaul",
},
{
  id: 17,
  fullname: "Quincy",
  email: "quincy@example.com",
  age: 27,
  contact_no: "6580800123",
  username: "quinc",
},
{
  id: 18,
  fullname: "Rachel",
  email: "rachel@example.com",
  age: 25,
  contact_no: "6580800134",
  username: "rach123",
},
{
  id: 19,
  fullname: "Steve",
  email: "steve@example.com",
  age: 33,
  contact_no: "6580800145",
  username: "stevetheman",
},
{
  id: 20,
  fullname: "Tina",
  email: "tina@example.com",
  age: 29,
  contact_no: "6580800156",
  username: "tinaworld",
},
{
  id: 21,
  fullname: "Uma",
  email: "uma@example.com",
  age: 31,
  contact_no: "6580800167",
  username: "umawesome",
},
{
  id: 22,
  fullname: "Victor",
  email: "victor@example.com",
  age: 28,
  contact_no: "6580800178",
  username: "vicv",
},
{
  id: 23,
  fullname: "Wendy",
  email: "wendy@example.com",
  age: 26,
  contact_no: "6580800189",
  username: "wendster",
},
{
  id: 24,
  fullname: "Xander",
  email: "xander@example.com",
  age: 34,
  contact_no: "6580800190",
  username: "xanxan",
},
{
  id: 25,
  fullname: "Yara",
  email: "yara@example.com",
  age: 22,
  contact_no: "6580800202",
  username: "yaraya",
},
{
  id: 26,
  fullname: "Zack",
  email: "zack@example.com",
  age: 35,
  contact_no: "6580800213",
  username: "zackattack",
},
{
  id: 27,
  fullname: "Amy",
  email: "amy@example.com",
  age: 30,
  contact_no: "6580800224",
  username: "amylove",
},
{
  id: 28,
  fullname: "Brian",
  email: "brian@example.com",
  age: 27,
  contact_no: "6580800235",
  username: "bri_guy",
},
{
  id: 29,
  fullname: "Cindy",
  email: "cindy@example.com",
  age: 25,
  contact_no: "6580800246",
  username: "cindster",
},
{
  id: 30,
  fullname: "Derek",
  email: "derek@example.com",
  age: 33,
  contact_no: "6580800257",
  username: "dman33",
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
