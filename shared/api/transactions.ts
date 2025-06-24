import api from "@/shared/api/api";
import { Transaction } from "@/shared/models/transaction";
import { useQuery } from "@tanstack/react-query";

export interface TransactionsFilter {
  searchTerm?: string;
  customer_type?: string;
  transaction_type?: string;
  product?: string;
  receipt_code?: string;
  msisdn?: string;
  fullname?: string;
  number_id?: string;
  package_name?: string;
  page?: number;
  limit?: number;
}

type TransactionAPIResponse = {
  data: Transaction[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

const fetchTransactions = async (
  filters: TransactionsFilter
): Promise<TransactionAPIResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("q", filters.searchTerm);
    if (filters.customer_type)
      params.append("customer_type", filters.customer_type);
    if (filters.transaction_type)
      params.append("transaction_type", filters.transaction_type);
    if (filters.product) params.append("product", filters.product);
    if (filters.receipt_code)
      params.append("receipt_code", filters.receipt_code);
    if (filters.msisdn) params.append("msisdn", filters.msisdn);
    if (filters.fullname) params.append("fullname", filters.fullname);
    if (filters.number_id) params.append("number_id", filters.number_id);
    if (filters.package_name)
      params.append("package_name", filters.package_name);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const url = `/transactions?${params.toString()}`;

    const response = await api.get<TransactionAPIResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions"); // Re-throw for React Query error handling
  }
};

export function useTransactionsQuery(filters: TransactionsFilter) {
  return useQuery<TransactionAPIResponse, Error>({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 1000 * 60 * 5, // 5 min fresh
    cacheTime: 1000 * 60 * 10, // 10 min memory cached
    // keepPreviousData: true, // Show old data while new data is loading (good UX for filters)
  });
}
