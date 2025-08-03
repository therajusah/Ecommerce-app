import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({
    title: '',
    message: '',
    icon: '',
    buttons: [] as any[]
  });

  const showCustomAlert = (title: string, message: string, icon: string, buttons: any[]) => {
    setAlertConfig({ title, message, icon, buttons });
    setShowAlert(true);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    showCustomAlert(
      'Logout',
      'Are you sure you want to logout?',
      'log-out-outline',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            clearCart();
            showCustomAlert(
              'Success',
              'You have been logged out successfully',
              'checkmark-circle',
              [{ text: 'OK', style: 'default' }]
            );
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: 'bag-outline',
      title: 'Order History',
      subtitle: 'View your past orders',
      onPress: () => navigation.navigate('TrackOrderTab'),
    },
    {
      icon: 'heart-outline',
      title: 'Wishlist',
      subtitle: 'Your favorite items',
      onPress: () => navigation.navigate('WishlistTab'),
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      onPress: () => showCustomAlert('Coming Soon', 'Address management coming soon!', 'information-circle', [{ text: 'OK', style: 'default' }]),
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => showCustomAlert('Coming Soon', 'Payment methods coming soon!', 'information-circle', [{ text: 'OK', style: 'default' }]),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'App notifications settings',
      onPress: () => showCustomAlert('Coming Soon', 'Notification settings coming soon!', 'information-circle', [{ text: 'OK', style: 'default' }]),
    },
    {
      icon: 'settings-outline',
      title: 'App Settings',
      subtitle: 'Manage app preferences',
      onPress: () => showCustomAlert('Coming Soon', 'App settings coming soon!', 'information-circle', [{ text: 'OK', style: 'default' }]),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => showCustomAlert('Support', 'For support, email us at support@myshop.com', 'mail', [{ text: 'OK', style: 'default' }]),
    },
    {
      icon: 'information-circle-outline',
      title: 'About MyShop',
      subtitle: 'App version and info',
      onPress: () => showCustomAlert('About MyShop', 'MyShop v1.0.0\nBuilt with React Native & Expo\n\nYour trusted shopping partner', 'information-circle', [{ text: 'OK', style: 'default' }]),
    },
  ];

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={24} color={colors.primary} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray} />
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <Header title="Profile" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isAuthenticated() ? (
          <>
            <View style={styles.userSection}>
              <Image
                source={{ uri: user?.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuSection}>
              {menuItems.map(renderMenuItem)}
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.white} />
              <Text style={styles.logoutButtonText}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.notLoggedIn}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoMy}>My</Text>
              <Text style={styles.logoShop}>Shop</Text>
            </View>
            <Text style={styles.notLoggedInTitle}>Welcome to MyShop!</Text>
            <Text style={styles.notLoggedInSubtitle}>
              Login to access your profile and enjoy personalized shopping experience with exclusive deals and offers
            </Text>
            
            <TouchableOpacity
              style={[globalStyles.yellowButton, styles.loginButton]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={18} color={colors.dark} />
              <Text style={[globalStyles.yellowButtonText, { marginLeft: spacing.xs }]}>
                Login / Register
              </Text>
            </TouchableOpacity>

            <View style={styles.guestMenuSection}>
              <Text style={styles.guestMenuTitle}>Explore MyShop</Text>
              {menuItems.slice(-2).map(renderMenuItem)}
            </View>
          </View>
        )}
      </ScrollView>

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
  userSection: {
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
    backgroundColor: colors.lightGray,
    borderWidth: 3,
    borderColor: colors.yellow,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  userEmail: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: spacing.lg,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.lightYellow,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  menuSection: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  notLoggedIn: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoMy: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoShop: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.yellow,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  notLoggedInSubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  loginButton: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  guestMenuSection: {
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...globalStyles.shadow,
  },
  guestMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: spacing.lg,
    paddingBottom: 0,
    color: colors.primary,
  },
});

export default ProfileScreen; 