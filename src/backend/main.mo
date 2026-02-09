import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Roles: Guest, User (Authenticated), Admin
  // Product lifecycle: Add, Update, Delete (Admin)
  // Cart: In-memory on frontend, persistent on backend FOR guest sessions (to allow login/persistence if they sign in)
  // Orders: Placed by user, stored with association to principal. Guest orders have anonymous principal (could ask for email for retrieval)

  // Types
  public type Money = {
    currency : Text;
    value : Nat;
  };

  public type Address = {
    name : Text;
    addressLine1 : Text;
    addressLine2 : ?Text;
    city : Text;
    zipcode : Text;
    country : Text;
    phoneNumber : ?Text;
  };

  public type Product = {
    id : Nat;
    title : Text;
    description : ?Text;
    price : Money;
    stock : Nat;
    sku : Text;
    category : Text; // Main category (add mapping for category tree/facets)
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  public type CartItem = {
    product : Product;
    quantity : Nat;
  };

  public type Cart = {
    items : [CartItem];
    totalPrice : Money;
    shippingAddress : ?Address;
    email : ?Text;
  };

  public type Order = {
    id : Nat;
    timestamp : Int;
    paid : Bool;
    cart : Cart;
    customerAddress : Address;
    owner : Principal; // Track order owner
    anonymous : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    defaultAddress : ?Address;
  };

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent State
  let productCatalog = Map.empty<Nat, Product>();
  let orderStore = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Order Store
  var orderIdCounter = 1;

  // Sample products
  let initialProducts = [
    {
      id = 1;
      title = "Acme Water Bottle";
      description = ?"Eco-friendly, BPA-free 1L water bottle. Dishwasher safe. Long-lasting hydration.";
      price = { currency = "USD"; value = 1499 };
      stock = 200;
      sku = "ACME-BOTTLE-001";
      category = "Home & Kitchen";
    },
    {
      id = 2;
      title = "Ergonomic Office Chair";
      description = ?"Adjustable lumbar support, breathable mesh. Long-lasting comfort for your home office.";
      price = { currency = "USD"; value = 34999 };
      stock = 37;
      sku = "ICHAIRS-ERG-CHAIR";
      category = "Office Supplies";
    },
    {
      id = 3;
      title = "Bluetooth Headphones";
      description = ?"Noise-cancelling, 30h battery life. Wireless, immersive audio experience.";
      price = { currency = "USD"; value = 8999 };
      stock = 140;
      sku = "SOUND-HEADPHONES-BT";
      category = "Electronics";
    },
    {
      id = 4;
      title = "Yoga Mat";
      description = ?"Non-slip, eco-conscious material. Perfect flexibility and comfort for yoga practice.";
      price = { currency = "USD"; value = 2499 };
      stock = 115;
      sku = "ZEN-YOGA-MAT";
      category = "Sports";
    },
    {
      id = 5;
      title = "Classic T-Shirt";
      description = ?"100% organic cotton. Timeless fit. Durable, breathable materials.";
      price = { currency = "USD"; value = 1999 };
      stock = 235;
      sku = "TEESHIRT-CLASSIC";
      category = "Apparel";
    },
    {
      id = 6;
      title = "Running Shoes";
      description = ?"Lightweight, shock-absorbing soles. Engineered for ultimate comfort and performance.";
      price = { currency = "USD"; value = 7999 };
      stock = 78;
      sku = "FASTSHOES-AIRRUN";
      category = "Sports";
    },
    {
      id = 7;
      title = "Gourmet Coffee Maker";
      description = ?"Programmable, multi-function. Brew barista-quality coffee at home.";
      price = { currency = "USD"; value = 12999 };
      stock = 32;
      sku = "COFFEETEC-PRO";
      category = "Home & Kitchen";
    },
    {
      id = 8;
      title = "All-Weather Jacket";
      description = ?"Water-resistant, insulated. Stay warm and dry in extreme weather.";
      price = { currency = "USD"; value = 9999 };
      stock = 65;
      sku = "COZYOUT-JACKET";
      category = "Apparel";
    },
    {
      id = 9;
      title = "Stainless Cookware Set";
      description = ?"Complete 10-piece set. Long-lasting, stainless steel construction for all your cooking needs.";
      price = { currency = "USD"; value = 11999 };
      stock = 41;
      sku = "KITCHEN-STEELSET";
      category = "Home & Kitchen";
    },
    {
      id = 10;
      title = "Wireless Keyboard";
      description = ?"Compact, ergonomic design. Smooth typing and comfort for long hours of productive work.";
      price = { currency = "USD"; value = 5999 };
      stock = 86;
      sku = "COMPTECH-WIRELESS-KB";
      category = "Office Supplies";
    },
    {
      id = 11;
      title = "Digital Picture Frame";
      description = ?"High-definition display, remote control, and easy photo sharing. Showcase memories in style.";
      price = { currency = "USD"; value = 6999 };
      stock = 54;
      sku = "IMAGEFRAME-HD-DIGI";
      category = "Electronics";
    },
    {
      id = 12;
      title = "Premium Leather Wallet";
      description = ?"Minimalist, RFID-blocking for security. Handmade with premium leather materials.";
      price = { currency = "USD"; value = 3999 };
      stock = 94;
      sku = "STYLECRAFT-LEATHER-WALLET";
      category = "Apparel";
    },
    {
      id = 13;
      title = "Essential Oil Diffuser";
      description = ?"Ultrasonic technology for better air quality. Ultra-quiet and effective. Soothing aromatherapy experience.";
      price = { currency = "USD"; value = 2999 };
      stock = 73;
      sku = "CALMIFY-DIFFUSER-TECH";
      category = "Home & Kitchen";
    },
    {
      id = 14;
      title = "High-Speed Blender";
      description = ?"Multiple functions for smoothies, juices, and more. Powerful and versatile appliance for your kitchen.";
      price = { currency = "USD"; value = 7999 };
      stock = 61;
      sku = "POWERBLEND-FOOD-JUICE";
      category = "Home & Kitchen";
    },
    {
      id = 15;
      title = "Travel Backpack";
      description = ?"Multi-pocketed design with RFID-blocking technology. Durable and organized for every adventure.";
      price = { currency = "USD"; value = 5999 };
      stock = 102;
      sku = "ADVENTURER-MULTI-POCKET";
      category = "Apparel";
    },
    {
      id = 16;
      title = "Wireless Earbuds";
      description = ?"Compact, noise-isolating, completely wireless. Superior sound and freedom.";
      price = { currency = "USD"; value = 7499 };
      stock = 129;
      sku = "SOUNDMINIPODS-TRUE-WIRELESS";
      category = "Electronics";
    },
    {
      id = 17;
      title = "Eco Toothbrush Set";
      description = ?"Biodegradable, sustainable, and packaged eco-consciously. 4-pack for your family's dental care.";
      price = { currency = "USD"; value = 1299 };
      stock = 187;
      sku = "ECOBRITE-TOOTHBRUSH-FAMILY";
      category = "Personal Care";
    },
    {
      id = 18;
      title = "Weighted Blanket";
      description = ?"Dual-sided comfort for stress reduction and better sleep. Luxurious, evenly distributed weight.";
      price = { currency = "USD"; value = 6999 };
      stock = 58;
      sku = "RELAXWEAVE-SLEEP-THERAPY";
      category = "Home & Kitchen";
    },
    {
      id = 19;
      title = "Fitness Yoga Ball";
      description = ?"Multi-purpose for exercise, posture, and physical therapy. Durable for all fitness levels.";
      price = { currency = "USD"; value = 2499 };
      stock = 97;
      sku = "FITBALL-PRO-EXERCISE";
      category = "Sports";
    },
    {
      id = 20;
      title = "Chef's Knife Set";
      description = ?"Precision-forged knives for professional-grade performance. Ultimate sharpness and balance.";
      price = { currency = "USD"; value = 8999 };
      stock = 38;
      sku = "CHEFESSENTIAL-KNIVES";
      category = "Home & Kitchen";
    },
  ];

  system func postupgrade() {
    for (product in initialProducts.values()) {
      productCatalog.add(product.id, product);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin Only)
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    productCatalog.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(stockId : Nat, product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (productCatalog.get(stockId)) {
      case (null) {
        Runtime.trap("Product not found. ID=" # stockId.toText());
      };
      case (?_existing) {
        productCatalog.add(stockId, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    productCatalog.remove(productId);
  };

  // Product Browsing (Public - no auth required)
  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    productCatalog.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productCatalog.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    productCatalog.values().toArray().sort().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func searchProducts(term : Text) : async [Product] {
    // Simple case-insensitive search implementation
    productCatalog.values().toArray().sort().filter(
      func(p) {
        p.title.toLower().contains(#text(term.toLower()));
      }
    );
  };

  public query ({ caller }) func getProductsByCategorySorted(category : Text, sortBy : Text, ascending : Bool) : async [Product] {
    let filteredProducts = productCatalog.values().toArray().filter(func(p) { p.category == category });

    let sortedProducts = filteredProducts.sort(
      func(product1, product2) {
        let result = switch (sortBy) {
          case ("price") { Nat.compare(product1.price.value, product2.price.value) };
          case ("title") { Text.compare(product1.title, product2.title) };
          case (_) { Nat.compare(product1.id, product2.id) };
        };
        if (ascending) { result } else {
          switch (result) {
            case (#less) { #greater };
            case (#greater) { #less };
            case (#equal) { #equal };
          };
        };
      }
    );

    sortedProducts;
  };

  // Checkout + Order Processing
  public shared ({ caller }) func createOrder(cart : Cart, address : Address) : async Nat {
    // Anyone can create an order (guests and authenticated users)
    let orderId = orderIdCounter;
    orderIdCounter += 1;

    let order : Order = {
      id = orderId;
      timestamp = 0;
      paid = false;
      cart;
      customerAddress = address;
      owner = caller; // Track who created the order
      anonymous = caller.isAnonymous();
    };

    orderStore.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    switch (orderStore.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Users can only see their own orders, admins can see all
        if (order.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    // Authenticated users can get their own orders
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view order history");
    };

    orderStore.values().toArray().filter(func(order) { order.owner == caller });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    // Admin only
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orderStore.values().toArray();
  };

  public query ({ caller }) func getOrdersByStatus(paid : Bool) : async [Order] {
    // Admin only
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can filter orders by status");
    };

    orderStore.values().toArray().filter(func(order) { order.paid == paid });
  };

  public query ({ caller }) func getOrdersByAddress(address : Address) : async [Order] {
    // Admin only guard check
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can search orders by address");
    };

    let orders = orderStore.values().toArray();
    let matchingOrders = orders.filter(
      func(order) {
        order.customerAddress.addressLine1 == address.addressLine1 and order.customerAddress.city == address.city and order.customerAddress.zipcode == address.zipcode and order.customerAddress.country == address.country
      }
    );
    matchingOrders;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, paid : Bool) : async () {
    // Admin only
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orderStore.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found. ID=" # orderId.toText());
      };
      case (?order) {
        let updatedOrder : Order = {
          id = orderId;
          timestamp = order.timestamp;
          paid;
          cart = order.cart;
          customerAddress = order.customerAddress;
          owner = order.owner;
          anonymous = order.anonymous;
        };
        orderStore.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrdersByProductId(productId : Nat) : async [Order] {
    // Admin only
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can search orders by product");
    };

    orderStore.values().toArray().filter(
      func(order) {
        order.cart.items.findIndex(func(item) { item.product.id == productId }) != null;
      }
    );
  };
};
