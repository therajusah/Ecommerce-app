import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';
import { NavigationProp } from '../types/navigation';

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

interface ProductDetailScreenProps {
  navigation: NavigationProp;
  route: {
    params: {
      product: Product;
    };
  };
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
  const { product } = route.params;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showCustomAlert(
      'Added to Cart!',
      `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart`,
      'checkmark-circle',
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', style: 'default', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigation.navigate('Cart');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color={colors.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color={colors.warning} />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color={colors.gray} />
      );
    }

    return stars;
  };

  const totalPrice = (product.price * quantity).toFixed(0);

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Product Details" 
        showBack={true}
        onBack={() => navigation.goBack()}
        showCart={true}
        onCartPress={handleCartPress}
        rightComponent={
          <TouchableOpacity onPress={handleWishlistToggle} style={{ marginRight: spacing.sm }}>
            <Ionicons 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={24} 
              color={isWishlisted ? colors.secondary : colors.white} 
            />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {!product.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(product.rating)}
            </View>
            <Text style={styles.ratingText}>({product.rating})</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {product.inStock && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={decrementQuantity}
                  style={[styles.quantityButton, quantity === 1 && styles.disabledButton]}
                  disabled={quantity === 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={quantity === 1 ? colors.gray : colors.dark} 
                  />
                </TouchableOpacity>
                
                <Text style={styles.quantity}>{quantity}</Text>
                
                <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                  <Ionicons name="add" size={20} color={colors.dark} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {product.inStock && quantity > 1 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total: </Text>
              <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {product.inStock && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[globalStyles.addToCartButton, styles.addToCartBtn]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="bag-add-outline" size={18} color={colors.white} />
            <Text style={[globalStyles.addToCartButtonText, { marginLeft: spacing.xs }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[globalStyles.buyNowButton, styles.buyNowBtn]}
            onPress={handleBuyNow}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={18} color={colors.white} />
            <Text style={[globalStyles.buyNowButtonText, { marginLeft: spacing.xs }]}>
              Buy Now
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
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  category: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stars: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  ratingText: {
    fontSize: 14,
    color: colors.gray,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 18,
    color: colors.gray,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  discountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: spacing.md,
    minWidth: 44,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  addToCartBtn: {
    flex: 1,
  },
  buyNowBtn: {
    flex: 1,
  },
});

export default ProductDetailScreen; 