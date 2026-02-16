import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const useProducts = (limit = 30) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', limit],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    enabled: !!category,
  });
};
