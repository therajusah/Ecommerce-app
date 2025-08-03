import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useCart } from '../context/CartContext';
import type { CartItem as CartItemType } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const totalPrice = (item.price * item.quantity).toFixed(0);

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.price}>₹{item.price}</Text>
        
        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              style={[styles.quantityButton, item.quantity === 1 && styles.disabledButton]}
              disabled={item.quantity === 1}
            >
              <Ionicons 
                name="remove" 
                size={16} 
                color={item.quantity === 1 ? colors.gray : colors.dark} 
              />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Ionicons name="add" size={16} color={colors.dark} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalPrice}>₹{totalPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    ...globalStyles.shadow,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    ...globalStyles.body,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  price: {
    ...globalStyles.caption,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    padding: spacing.sm,
    minWidth: 32,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantity: {
    ...globalStyles.body,
    fontWeight: '600',
    marginHorizontal: spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  totalPrice: {
    ...globalStyles.price,
    fontSize: 16,
  },
});

export default CartItem; 