interface Transaction {
  id: string;
  transaction_type: string;
  transaction_date: string;
  is_renewal: boolean;
  is_new_activation: boolean;
  customer: Customer;
  selected_msisdn: string;
  user: User;
  items: TransactionItem[];
  total: number;
  is_refunded: boolean;
  refund_expired: string;
  is_voided: boolean;
  void_expired: boolean;
}

interface Customer {
  id: number;
  slug: string;
  fullname: string;
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

interface Package {
  id: string;
  name: string;
}

interface TransactionItem {
  id: number;
  package: Package;
  product_id: string;
  qty: string;
  price: string;
  total: string;
  phone_number: string;
}

export type { Customer, Package, Transaction, TransactionItem, User };
