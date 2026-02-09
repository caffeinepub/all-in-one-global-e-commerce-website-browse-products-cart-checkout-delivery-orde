import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetProductsByCategory } from '../hooks/useQueries';
import ProductGrid from '../components/products/ProductGrid';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const { categoryName } = useParams({ from: '/category/$categoryName' });
  const { data: products, isLoading } = useGetProductsByCategory(categoryName);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-muted-foreground">
          {products?.length || 0} products available
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ProductGrid products={products || []} />
      )}
    </div>
  );
}
