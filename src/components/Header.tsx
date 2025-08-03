import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from '../styles/globalStyles';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLogo?: boolean;
  showCart?: boolean;
  onCartPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showLogo = false,
  showCart = false,
  onCartPress,
  rightComponent,
}) => {
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBack && onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          {showLogo ? (
            <View style={styles.logoContainer}>
              <Text style={styles.logoMy}>My</Text>
              <Text style={styles.logoShop}>Shop</Text>
            </View>
          ) : (
            title && <Text style={styles.title}>{title}</Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {showCart && onCartPress && (
            <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
              <Ionicons name="bag-outline" size={24} color={colors.white} />
              {cartItemsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItemsCount > 99 ? '99+' : cartItemsCount.toString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMy: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  logoShop: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.yellow,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.yellow,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.dark,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header; 