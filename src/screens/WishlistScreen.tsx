import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';
import { NavigationProp } from '../types/navigation';
import { products } from '../data/products';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface WishlistScreenProps {
  navigation: NavigationProp;
}

const WishlistScreen: React.FC<WishlistScreenProps> = ({ navigation }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({
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

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: WishlistItem) => {
    addToCart(product);
    showCustomAlert(
      'Added to Cart!',
      `${product.name} has been added to your cart`,
      'checkmark-circle',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleProductPress = (wishlistItem: WishlistItem) => {
    const product = products.find(p => p.id === wishlistItem.id);
    if (product) {
      navigation.navigate('ProductDetail', { product });
    }
  };

  const handleClearWishlist = () => {
    showCustomAlert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      'alert-circle',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearWishlist() }
      ]
    );
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.productInfo}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <Text style={styles.productPrice}>₹{item.price}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromWishlist(item.id)}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={20} color={colors.secondary} />
        </TouchableOpacity>

        {item.inStock && (
          <TouchableOpacity
            style={globalStyles.addToCartButton}
            onPress={() => handleAddToCart(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="bag-add" size={16} color={colors.white} />
            <Text style={[globalStyles.addToCartButtonText, { marginLeft: spacing.xs }]}>
              Add
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.gray} />
      <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add products to your wishlist by tapping the heart icon
      </Text>
      <TouchableOpacity
        style={[globalStyles.yellowButton, styles.shopButton]}
        onPress={() => navigation.navigate('HomeTab')}
        activeOpacity={0.8}
      >
        <Ionicons name="storefront-outline" size={18} color={colors.dark} />
        <Text style={[globalStyles.yellowButtonText, { marginLeft: spacing.xs }]}>
          Start Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated()) {
    return (
      <View style={globalStyles.container}>
        <Header title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptySubtitle}>
            Please login to view and manage your wishlist
          </Text>
          <TouchableOpacity
            style={[globalStyles.yellowButton, styles.shopButton]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={18} color={colors.dark} />
            <Text style={[globalStyles.yellowButtonText, { marginLeft: spacing.xs }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
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
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Wishlist" 
        rightComponent={
          wishlist.items.length > 0 ? (
            <TouchableOpacity onPress={handleClearWishlist} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          ) : null
        }
      />

      {wishlist.items.length === 0 ? (
        renderEmptyWishlist()
      ) : (
        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''} in your wishlist
            </Text>
          </View>

          <FlatList
            data={wishlist.items}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
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
    backgroundColor: colors.background,
  },
  statsContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  statsText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...globalStyles.shadow,
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  productCategory: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: spacing.xs,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButtons: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  separator: {
    height: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.primary,
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
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WishlistScreen; 