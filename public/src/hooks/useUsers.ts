import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export const useUsers = (limit = 30) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', limit],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/users?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });
};

export const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: !!id,
  });
};
