export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone connectivity. Track your health 24/7.",
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.3,
    inStock: true
  },
  {
    id: 3,
    name: "Cotton Casual T-Shirt",
    description: "Comfortable 100% cotton t-shirt perfect for casual wear. Available in multiple colors and sizes.",
    price: 599,
    originalPrice: 799,
    discount: 25,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    category: "Clothing",
    rating: 4.2,
    inStock: true
  },
  {
    id: 4,
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with powerful graphics card and fast processor. Perfect for gaming and professional work.",
    price: 75999,
    originalPrice: 89999,
    discount: 15,
    image: "https://images.unsplash.com/photo-1525373612132-b3e820b87cea?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    description: "Portable wireless speaker with excellent sound quality and long battery life. Perfect for outdoor activities.",
    price: 1799,
    originalPrice: 2299,
    discount: 22,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.4,
    inStock: true
  },
  {
    id: 6,
    name: "Running Shoes",
    description: "Comfortable running shoes with excellent cushioning and support. Perfect for daily running and sports activities.",
    price: 3299,
    originalPrice: 4199,
    discount: 21,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    category: "Sports",
    rating: 4.3,
    inStock: true
  },
  {
    id: 7,
    name: "Backpack",
    description: "Durable and spacious backpack perfect for travel, work, or school. Multiple compartments for organization.",
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "Accessories",
    rating: 4.1,
    inStock: true
  },
  {
    id: 8,
    name: "Smartphone",
    description: "Latest smartphone with advanced camera system and fast performance. Stay connected with cutting-edge technology.",
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.5,
    inStock: false
  }
];

export const categories: string[] = [
  'All',
  'Electronics',
  'Clothing',
  'Sports',
  'Accessories'
]; 