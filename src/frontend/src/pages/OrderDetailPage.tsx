import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Package, MapPin } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  const formatPrice = (value: bigint, currency: string) => {
    const amount = Number(value) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Button onClick={() => navigate({ to: '/orders' })}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <AuthGate>
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/orders' })}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{order.id.toString()}</CardTitle>
                  <Badge variant={order.paid ? 'default' : 'secondary'}>
                    {order.paid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {order.cart.items.map((item) => (
                      <div key={item.product.id.toString()} className="flex gap-4">
                        <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-2xl">📦</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity.toString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(
                              BigInt(Number(item.product.price.value) * Number(item.quantity)),
                              item.product.price.currency
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{order.customerAddress.name}</p>
                <p className="text-muted-foreground">{order.customerAddress.addressLine1}</p>
                {order.customerAddress.addressLine2 && (
                  <p className="text-muted-foreground">{order.customerAddress.addressLine2}</p>
                )}
                <p className="text-muted-foreground">
                  {order.customerAddress.city}, {order.customerAddress.zipcode}
                </p>
                <p className="text-muted-foreground">{order.customerAddress.country}</p>
                {order.customerAddress.phoneNumber && (
                  <p className="text-muted-foreground">{order.customerAddress.phoneNumber}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.cart.items.map((item) => (
                    <div key={item.product.id.toString()} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.title} × {item.quantity.toString()}
                      </span>
                      <span className="font-medium">
                        {formatPrice(
                          BigInt(Number(item.product.price.value) * Number(item.quantity)),
                          item.product.price.currency
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {formatPrice(order.cart.totalPrice.value, order.cart.totalPrice.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
