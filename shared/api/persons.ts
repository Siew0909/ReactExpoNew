import api from "@/shared/api/api";
import { Person } from "@/shared/models/person";
import { useQuery } from "@tanstack/react-query";

export interface PersonsFilter {
  searchTerm?: string;
  name?: string;
  username?: string;
  email?: string;
  number_id?: string;
  phone?: string;
  page?: number;
  limit?: number;
}

type PersonAPIResponse = {
  data: Person[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

const fetchPersons = async (
  filters: PersonsFilter
): Promise<PersonAPIResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("q", filters.searchTerm);
    if (filters.phone) params.append("phone", filters.phone);
    if (filters.name) params.append("name", filters.name);
    if (filters.number_id) params.append("number_id", filters.number_id);
    if (filters.email) params.append("email", filters.email);
    if (filters.username) params.append("username", filters.username);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const url = `/users?${params.toString()}`;

    const response = await api.get<PersonAPIResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    throw new Error("Failed to fetch persons"); // Re-throw for React Query error handling
  }
};

export function usePersonsQuery(filters: PersonsFilter) {
  return useQuery<PersonAPIResponse, Error>({
    queryKey: ["users", filters],
    queryFn: () => fetchPersons(filters),
    staleTime: 1000 * 60 * 5, // 5 min fresh
    cacheTime: 1000 * 60 * 10, // 10 min memory cached
    // keepPreviousData: true, // Show old data while new data is loading (good UX for filters)
  });
}
