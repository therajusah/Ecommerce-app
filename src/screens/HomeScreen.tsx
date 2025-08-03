import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';
import Header from '../components/Header';
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

interface HomeScreenProps {
  navigation: NavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        showLogo={true}
        showCart={true} 
        onCartPress={handleCartPress}
      />
      
      {filteredProducts.length === 0 ? (
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <HomeHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryPress={handleCategoryPress}
            filteredProducts={filteredProducts}
          />
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={64} color={colors.gray} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No products found for your search' : 'No products in this category'}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <ProductCard 
                product={item} 
                onPress={() => handleProductPress(item)} 
                showAddToCart={false}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ListHeaderComponent={
            <HomeHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
              filteredProducts={filteredProducts}
            />
          }
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        />
      )}
    </View>
  );
};

interface HomeHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  onCategoryPress: (category: string) => void;
  filteredProducts: Product[];
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onCategoryPress,
  filteredProducts,
}) => (
  <View style={styles.headerContent}>
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products, brands and more"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        blurOnSubmit={false}
        placeholderTextColor={colors.gray}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close" size={20} color={colors.gray} />
        </TouchableOpacity>
      ) : null}
    </View>

    <View style={styles.carouselWrapper}>
      <ImageCarousel
        images={[
          'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2069&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1620012253295-8fa4b0ccf33c?q=80&w=2069&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2069&auto=format&fit=crop',
        ]}
        height={180}
      />
    </View>

    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton,
            ]}
            onPress={() => onCategoryPress(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.selectedCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>

    <View style={styles.productsHeader}>
      <Text style={styles.sectionTitle}>
        {searchQuery ? `Search Results (${filteredProducts.length})` : 
         selectedCategory === 'All' ? 'All Products' : selectedCategory}
      </Text>
      {!searchQuery && selectedCategory === 'All' && (
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  carouselWrapper: {
    marginBottom: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMy: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoShop: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.yellow,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginVertical: spacing.md,
    ...globalStyles.shadow,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
  },
  categoriesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...globalStyles.subtitle,
    marginBottom: spacing.md,
  },
  categoriesList: {
    paddingRight: spacing.md,
  },
  categoryButton: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: colors.yellow,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.dark,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: colors.dark,
    fontWeight: 'bold',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  productContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  productsList: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginTop: spacing.xxl,
  },
  emptyStateText: {
    ...globalStyles.body,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default HomeScreen; 