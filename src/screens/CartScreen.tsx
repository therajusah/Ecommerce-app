import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import CustomAlert from '../components/CustomAlert';
import { NavigationProp } from '../types/navigation';

interface CartItemType {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartScreenProps {
  navigation: NavigationProp;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { cart, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: '',
    buttons: [] as Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => void;
    }>
  });

  const showCustomAlert = (title: string, message: string, icon: string, buttons: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>) => {
    setAlertConfig({ title, message, icon, buttons });
    setShowAlert(true);
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      showCustomAlert(
        'Login Required',
        'Please login to proceed with checkout',
        'person-outline',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', style: 'default', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (cart.items.length === 0) {
      showCustomAlert(
        'Empty Cart',
        'Please add items to your cart before checkout',
        'bag-outline',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    showCustomAlert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      'trash-outline',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart();
            showCustomAlert(
              'Cart Cleared',
              'Your cart has been cleared successfully',
              'checkmark-circle',
              [{ text: 'OK', style: 'default' }]
            );
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItemType }) => <CartItem item={item} />;

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color={colors.gray} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some products to your cart to get started
      </Text>
      
      <TouchableOpacity
        style={[globalStyles.yellowButton, styles.shopButton]}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <Ionicons name="storefront-outline" size={20} color={colors.dark} />
        <Text style={[globalStyles.yellowButtonText, { marginLeft: spacing.sm }]}>
          Start Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartSummary = () => {
    const total = getCartTotal();
    const itemsCount = getCartItemsCount();
    const tax = total * 0.18;
    const shipping = total > 500 ? 0 : 50;
    const finalTotal = total + tax + shipping;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal ({itemsCount} item{itemsCount !== 1 ? 's' : ''})
          </Text>
          <Text style={styles.summaryValue}>₹{total.toFixed(0)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (18%)</Text>
          <Text style={styles.summaryValue}>₹{tax.toFixed(0)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Charges</Text>
          <Text style={styles.summaryValue}>
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}
          </Text>
        </View>
        
        {total > 500 && shipping === 0 && (
          <Text style={styles.freeShippingText}>
            🎉 You got free delivery!
          </Text>
        )}
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{finalTotal.toFixed(0)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Shopping Cart" 
        showBack={true}
        onBack={() => navigation.goBack()}
        rightComponent={
          cart.items.length > 0 ? (
            <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          ) : null
        }
      />

      {cart.items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <View style={styles.content}>
          <FlatList
            data={cart.items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          {renderCartSummary()}
          
          <TouchableOpacity
            style={[globalStyles.buyNowButton, styles.checkoutButton]}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Ionicons name="card-outline" size={18} color={colors.white} />
            <Text style={[globalStyles.buyNowButtonText, { marginLeft: spacing.xs }]}>
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <CustomAlert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        buttons={alertConfig.buttons}
        onDismiss={() => setShowAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  shopButton: {
    paddingHorizontal: spacing.xl,
  },
  cartList: {
    padding: spacing.md,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...globalStyles.shadow,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.dark,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  freeShippingText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  clearButton: {
    padding: spacing.xs,
  },
});

export default CartScreen; 