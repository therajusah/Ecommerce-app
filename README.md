# MyShop - React Native Ecommerce App

A modern, feature-rich ecommerce mobile application built with React Native and Expo.

## Features

### Core Shopping Features
- Product Catalog: Browse products with categories and search functionality
- Product Details: View detailed product information with images and descriptions
- Shopping Cart: Add products to cart with quantity management
- Wishlist: Save favorite products for later purchase
- Checkout Process: Complete checkout with address input and Cash on Delivery (COD) payment
- Order Tracking: Track order status with detailed progress updates

### User Management
- User Authentication: Login and registration system
- Profile Management: Edit user profile with photo upload capability
- Order History: View past orders and their current status
- Address Management: Save and manage delivery addresses

### User Interface
- Modern Design: Clean, intuitive interface inspired by popular ecommerce platforms
- Responsive Layout: Optimized for various screen sizes
- Custom Alerts: Beautiful, animated alert dialogs
- Bottom Navigation: Easy navigation between main sections
- Search Functionality: Find products quickly with search bar

## Technology Stack

- React Native: Cross-platform mobile development framework
- Expo: Development platform and build tools
- TypeScript: Type-safe JavaScript development
- React Navigation: Navigation between screens
- Context API: Global state management
- Expo Vector Icons: Icon library for UI elements

## Project Structure

```
EcommerceApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   ├── CustomAlert.tsx
│   │   └── SplashScreen.tsx
│   ├── context/            # Global state management
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   └── OrderContext.tsx
│   ├── screens/            # Main application screens
│   │   ├── HomeScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── WishlistScreen.tsx
│   │   ├── TrackOrderScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   └── LoginScreen.tsx
│   ├── data/              # Static data and models
│   │   └── products.ts
│   └── styles/            # Global styles and theming
│       └── globalStyles.ts
├── assets/                # Images and static assets
├── App.tsx               # Main application component
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Expo CLI (npm install -g @expo/cli)
- Expo Go app on your mobile device

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd EcommerceApp
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Run on device
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press 'a' for Android emulator or 'i' for iOS simulator

## Usage Guide

### Getting Started
1. Launch the app and you'll see the home screen with product catalog
2. Browse products by category or use the search bar
3. Tap on any product to view details
4. Add products to cart or wishlist using the respective buttons

### Shopping Process
1. Add to Cart: Tap "Add to Cart" on any product
2. View Cart: Navigate to Cart tab to see selected items
3. Checkout: Tap "Proceed to Checkout" to complete purchase
4. Enter Address: Fill in delivery address details
5. Payment: Choose Cash on Delivery (COD) option
6. Order Confirmation: Receive order confirmation with tracking details

### User Account
1. Login: Use the Profile tab to login with demo credentials
   - Email: demo@myshop.com
   - Password: demo123
2. Profile Management: Edit profile information and photo
3. Order Tracking: View order history and current status
4. Wishlist: Manage saved products for future purchase

### Navigation
- Home Tab: Browse products and categories
- Wishlist Tab: View saved favorite products
- Track Order Tab: Check order status and history
- Profile Tab: User account and settings

## Key Features Explained

### Product Management
The app includes a comprehensive product catalog with categories like Electronics, Fashion, Home & Garden, and Sports. Each product displays with image, name, price, discount, and rating.

### Shopping Cart
Cart functionality includes quantity adjustment, total calculation, and item removal. The cart persists across app sessions and integrates with the checkout process.

### Order Tracking
Orders are tracked through multiple stages: Order Placed, Processing, Shipped, Out for Delivery, and Delivered. Each stage shows relevant details and timestamps.

### Custom Alerts
The app uses custom animated alert dialogs instead of basic system alerts, providing a more polished user experience with better visual feedback.

### Responsive Design
The interface adapts to different screen sizes with proper spacing, typography, and layout considerations for mobile devices.

## Development Notes

### State Management
The app uses React Context API for global state management across four main contexts:
- AuthContext: User authentication and profile data
- CartContext: Shopping cart items and totals
- WishlistContext: Saved favorite products
- OrderContext: Order history and tracking data

### Styling Approach
Global styles are centralized in globalStyles.ts with consistent color schemes, spacing, and component styles. The design follows modern mobile UI patterns with proper shadows, borders, and typography.

### TypeScript Integration
Full TypeScript support provides type safety across all components, interfaces, and data models, improving code quality and development experience.

## Demo Credentials

For testing purposes, use these demo credentials:
- Email: demo@myshop.com
- Password: demo123

