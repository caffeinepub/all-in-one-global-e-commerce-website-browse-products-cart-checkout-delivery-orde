import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../backend';
import { useCart } from '../../state/CartProvider';
import { toast } from 'sonner';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.title} added to cart`);
  };

  const formatPrice = (value: bigint, currency: string) => {
    const amount = Number(value) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id.toString()}
          to="/product/$productId"
          params={{ productId: product.id.toString() }}
          className="group"
        >
          <Card className="h-full flex flex-col transition-shadow hover:shadow-lg">
            <CardContent className="p-4 flex-1">
              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-4xl">📦</div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price.value, product.price.currency)}
                  </span>
                  {Number(product.stock) > 0 ? (
                    <Badge variant="secondary" className="text-xs">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full gap-2"
                onClick={(e) => handleAddToCart(product, e)}
                disabled={Number(product.stock) === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
