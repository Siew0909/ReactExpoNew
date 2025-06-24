
interface Person {
  id: number;
  slug: string;
  name: string;
  number_id: string;
  wp_number: string;
  registration_type: string | null;
  is_wifi: boolean;
  is_mobile: boolean;
  is_registered_mobile: boolean;
}

interface User {
  name: string;
  username: string;
}


export type { Person, User };