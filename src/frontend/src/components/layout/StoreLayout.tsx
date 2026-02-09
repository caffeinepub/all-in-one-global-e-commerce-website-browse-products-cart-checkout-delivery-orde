import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Search, Menu, X, User, Package, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../state/CartProvider';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useUserProfile';
import { useIsCallerAdmin } from '../../hooks/useAdminProducts';
import { useQueryClient } from '@tanstack/react-query';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: '/search', search: { q: searchTerm } });
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    'Electronics',
    'Home & Kitchen',
    'Apparel',
    'Sports',
    'Office Supplies',
    'Personal Care',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">Kaninwals E Commerce</span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <LoginButton />
              
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {userProfile?.name || 'User'}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ to: '/orders' })}>
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/products' })}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: '/cart' })}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>
                  
                  <LoginButton />
                  
                  {isAuthenticated && (
                    <>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          navigate({ to: '/orders' });
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => {
                            navigate({ to: '/admin/products' });
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      navigate({ to: '/cart' });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t">
          <div className="container-custom">
            <nav className="flex items-center space-x-6 overflow-x-auto py-3 text-sm">
              {categories.map((category) => (
                <Link
                  key={category}
                  to="/category/$categoryName"
                  params={{ categoryName: category }}
                  className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Kaninwals E Commerce</h3>
              <p className="text-sm text-muted-foreground">
                Your one-stop destination for products from around the world, delivered to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories.slice(0, 4).map((category) => (
                  <li key={category}>
                    <Link
                      to="/category/$categoryName"
                      params={{ categoryName: category }}
                      className="hover:text-foreground transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Contact Us</li>
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/orders" className="hover:text-foreground transition-colors">
                        My Orders
                      </Link>
                    </li>
                    <li>Profile</li>
                  </>
                ) : (
                  <li>Sign In</li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
