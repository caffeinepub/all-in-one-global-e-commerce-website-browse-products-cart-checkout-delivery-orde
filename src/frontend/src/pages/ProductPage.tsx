import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useCart } from '../state/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  const formatPrice = (value: bigint, currency: string) => {
    const amount = Number(value) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.title} added to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
      </div>
    );
  }

  const inStock = Number(product.stock) > 0;

  return (
    <div className="container-custom py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <Card>
            <CardContent className="p-8">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-9xl">📦</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price.value, product.price.currency)}
            </p>
          </div>

          <Separator />

          {product.description && (
            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {inStock ? (
                  <Badge variant="secondary">In Stock ({product.stock.toString()} available)</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">SKU:</span>
              <span className="text-sm font-mono">{product.sku}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!inStock}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(Number(product.stock), quantity + 1))}
                  disabled={!inStock}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
