import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

interface Product {
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

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Checkout: undefined;
  Login: undefined;
  Wishlist: undefined;
  TrackOrder: undefined;
  Profile: undefined;
  EditProfile: undefined;
  HomeTab: undefined;
  WishlistTab: undefined;
  TrackOrderTab: undefined;
  ProfileTab: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  WishlistTab: undefined;
  TrackOrderTab: undefined;
  ProfileTab: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>; 