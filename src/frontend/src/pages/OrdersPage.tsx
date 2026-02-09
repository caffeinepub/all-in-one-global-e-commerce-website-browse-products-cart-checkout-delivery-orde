import React from 'react';
import { Link } from '@tanstack/react-router';
import { useGetMyOrders } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';

export default function OrdersPage() {
  const { data: orders, isLoading } = useGetMyOrders();

  const formatPrice = (value: bigint, currency: string) => {
    const amount = Number(value) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <AuthGate message="Please sign in to view your orders">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.toString()}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.cart.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(order.cart.totalPrice.value, order.cart.totalPrice.currency)}
                      </p>
                      <Badge variant={order.paid ? 'default' : 'secondary'} className="mt-1">
                        {order.paid ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Delivering to {order.customerAddress.city}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/orders/$orderId" params={{ orderId: order.id.toString() }}>
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthGate>
  );
}
