import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader2, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
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
        <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order Number</span>
              <span className="font-mono font-semibold">#{order.id.toString()}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items
            </h3>
            <div className="space-y-2">
              {order.cart.items.map((item) => (
                <div key={item.product.id.toString()} className="flex justify-between text-sm">
                  <span>
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
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.customerAddress.name}</p>
              <p>{order.customerAddress.addressLine1}</p>
              {order.customerAddress.addressLine2 && <p>{order.customerAddress.addressLine2}</p>}
              <p>
                {order.customerAddress.city}, {order.customerAddress.zipcode}
              </p>
              <p>{order.customerAddress.country}</p>
              {order.customerAddress.phoneNumber && <p>{order.customerAddress.phoneNumber}</p>}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(order.cart.totalPrice.value, order.cart.totalPrice.currency)}</span>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: '/orders' })} className="flex-1">
              View All Orders
            </Button>
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
