import React, { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useSearchProducts } from '../hooks/useQueries';
import ProductGrid from '../components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearch({ from: '/search' });
  const initialQuery = (searchParams as any)?.q || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: products, isLoading } = useSearchProducts(debouncedTerm);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
            autoFocus
          />
        </div>
        {debouncedTerm && (
          <p className="text-muted-foreground mt-4">
            {isLoading ? 'Searching...' : `${products?.length || 0} results for "${debouncedTerm}"`}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : debouncedTerm ? (
        <ProductGrid products={products || []} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a search term to find products</p>
        </div>
      )}
    </div>
  );
}
