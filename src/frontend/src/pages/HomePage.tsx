import React from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductGrid from '../components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, Package, Truck, Shield } from 'lucide-react';

export default function HomePage() {
  const { data: products, isLoading } = useGetAllProducts();

  const categories = React.useMemo(() => {
    if (!products) return [];
    const categorySet = new Set(products.map(p => p.category));
    return Array.from(categorySet);
  }, [products]);

  const featuredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.slice(0, 8);
  }, [products]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Shop the World from One Place
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing products from around the globe, all delivered to your doorstep with ease.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/search">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Global Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Access thousands of products from around the world in one convenient marketplace.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and reliable shipping to get your orders to you as fast as possible.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Shopping</h3>
                <p className="text-sm text-muted-foreground">
                  Shop with confidence using our secure checkout and authentication system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 border-b">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to="/category/$categoryName"
                params={{ categoryName: category }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">
                      {category === 'Electronics' && '💻'}
                      {category === 'Home & Kitchen' && '🏠'}
                      {category === 'Apparel' && '👕'}
                      {category === 'Sports' && '⚽'}
                      {category === 'Office Supplies' && '📎'}
                      {category === 'Personal Care' && '🧴'}
                    </div>
                    <h3 className="font-medium text-sm">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link to="/search">View All</Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>
    </div>
  );
}
