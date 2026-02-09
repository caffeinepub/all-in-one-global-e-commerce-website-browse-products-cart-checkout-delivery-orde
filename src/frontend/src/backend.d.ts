import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Address {
    country: string;
    city: string;
    name: string;
    zipcode: string;
    addressLine1: string;
    addressLine2?: string;
    phoneNumber?: string;
}
export interface Money {
    value: bigint;
    currency: string;
}
export interface Cart {
    email?: string;
    shippingAddress?: Address;
    items: Array<CartItem>;
    totalPrice: Money;
}
export interface CartItem {
    quantity: bigint;
    product: Product;
}
export interface Order {
    id: bigint;
    owner: Principal;
    cart: Cart;
    paid: boolean;
    anonymous: boolean;
    customerAddress: Address;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    defaultAddress?: Address;
}
export interface Product {
    id: bigint;
    sku: string;
    title: string;
    description?: string;
    stock: bigint;
    category: string;
    price: Money;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(cart: Cart, address: Address): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrdersByAddress(address: Address): Promise<Array<Order>>;
    getOrdersByProductId(productId: bigint): Promise<Array<Order>>;
    getOrdersByStatus(paid: boolean): Promise<Array<Order>>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsByCategorySorted(category: string, sortBy: string, ascending: boolean): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(term: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: bigint, paid: boolean): Promise<void>;
    updateProduct(stockId: bigint, product: Product): Promise<void>;
}
