import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';

interface AccessDeniedScreenProps {
  message?: string;
}

export default function AccessDeniedScreen({ message }: AccessDeniedScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="container-custom py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            {message || 'You do not have permission to access this page'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
