import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';
import { NavigationProp } from '../types/navigation';

interface TrackingStep {
  message: string;
  timestamp?: string;
  completed: boolean;
}

interface Order {
  id: string;
  orderDate: string;
  estimatedDelivery: string;
  status: string;
  totalAmount: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    pincode: string;
  };
  paymentMethod: string;
  trackingSteps: TrackingStep[];
}

interface TrackOrderScreenProps {
  navigation: NavigationProp;
}

const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({ navigation }) => {
  const { orders, updateOrderStatus, cancelOrder } = useOrder();
  const { isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      orders.forEach(order => {
        if (order.status === 'confirmed') {
          updateOrderStatus(order.id, 'processing');
        } else if (order.status === 'processing') {
          updateOrderStatus(order.id, 'shipped');
        } else if (order.status === 'shipped') {
          updateOrderStatus(order.id, 'delivered');
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [orders, updateOrderStatus]);

  const showCustomAlert = (title: string, message: string, icon: string, buttons: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>) => {
    setAlertConfig({ title, message, icon, buttons });
    setShowAlert(true);
  };

  const handleCancelOrder = (orderId: string) => {
    showCustomAlert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      'close-circle',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => {
            cancelOrder(orderId);
            setSelectedOrder(null);
            showCustomAlert(
              'Order Cancelled',
              'Your order has been cancelled successfully.',
              'checkmark-circle',
              [{ text: 'OK', style: 'default' }]
            );
          }
        }
      ]
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return colors.primary;
      case 'processing':
        return colors.warning;
      case 'shipped':
        return colors.success;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'processing':
        return 'time';
      case 'shipped':
        return 'car';
      case 'delivered':
        return 'checkmark-done-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTrackingStep = ({ item, index }: { item: TrackingStep; index: number }) => {
    const isCompleted = item.completed;
    const isLast = index === selectedOrder!.trackingSteps.length - 1;

    return (
      <View style={styles.trackingStep}>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, isCompleted && styles.completedDot]}>
            <Ionicons
              name={isCompleted ? 'checkmark' : 'ellipse'}
              size={12}
              color={isCompleted ? colors.white : colors.gray}
            />
          </View>
          {!isLast && (
            <View style={[styles.stepLine, isCompleted && styles.completedLine]} />
          )}
        </View>

        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, isCompleted && styles.completedText]}>
            {item.message}
          </Text>
          {item.timestamp && (
            <Text style={styles.stepTime}>
              {formatDate(item.timestamp)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => setSelectedOrder(item)}
      activeOpacity={0.8}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>
            {formatDate(item.orderDate)}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as keyof typeof Ionicons.glyphMap} 
            size={16} 
            color={colors.white} 
          />
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderItems}>
          {item.items.length} item{item.items.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.orderAmount}>₹{item.totalAmount.toFixed(0)}</Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.deliveryText}>
          {item.status === 'delivered' 
            ? 'Delivered' 
            : `Est. delivery: ${formatDate(item.estimatedDelivery).split(',')[0]}`
          }
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.gray} />
      </View>
    </TouchableOpacity>
  );

  const renderOrderDetails = () => (
    <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.detailsHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedOrder(null)}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.detailsTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsOrderId}>Order #{selectedOrder!.id}</Text>
        <Text style={styles.detailsDate}>
          Placed on {formatDate(selectedOrder!.orderDate)}
        </Text>

        <View style={styles.trackingContainer}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <FlatList
            data={selectedOrder!.trackingSteps}
            renderItem={renderTrackingStep}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{selectedOrder!.deliveryAddress.fullName}</Text>
            <Text style={styles.addressPhone}>{selectedOrder!.deliveryAddress.phone}</Text>
            <Text style={styles.addressText}>
              {selectedOrder!.deliveryAddress.street}, {selectedOrder!.deliveryAddress.city}
            </Text>
            <Text style={styles.addressText}>
              Pincode: {selectedOrder!.deliveryAddress.pincode}
            </Text>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {selectedOrder!.items.map((item, index) => (
            <View key={index} style={styles.orderItemCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(0)}</Text>
              </View>
            </View>
          ))}
        </View>

        {(selectedOrder!.status === 'confirmed' || selectedOrder!.status === 'processing') && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelOrder(selectedOrder!.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color={colors.gray} />
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptySubtitle}>
        Start shopping to see your order tracking information here
      </Text>
      <TouchableOpacity
        style={[globalStyles.yellowButton, styles.shopButton]}
        onPress={() => navigation.navigate('HomeTab')}
        activeOpacity={0.8}
      >
        <Text style={globalStyles.yellowButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated()) {
    return (
      <View style={globalStyles.container}>
        <Header title="Track Orders" />
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptySubtitle}>
            Please login to track your orders
          </Text>
          <TouchableOpacity
            style={[globalStyles.yellowButton, styles.shopButton]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.yellowButtonText}>Login</Text>
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

  if (selectedOrder) {
    return (
      <View style={globalStyles.container}>
        {renderOrderDetails()}
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
      <Header title="Track Orders" />

      {orders.length === 0 ? (
        renderEmptyOrders()
      ) : (
        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </Text>
          </View>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
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
    padding: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...globalStyles.shadow,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  orderItems: {
    fontSize: 14,
    color: colors.gray,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  separator: {
    height: spacing.md,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  detailsCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...globalStyles.shadow,
  },
  detailsOrderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  detailsDate: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xl,
  },
  trackingContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.primary,
  },
  trackingStep: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  completedDot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  completedLine: {
    backgroundColor: colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.gray,
  },
  completedText: {
    color: colors.dark,
  },
  stepTime: {
    fontSize: 12,
    color: colors.gray,
  },
  addressSection: {
    marginBottom: spacing.xl,
  },
  addressCard: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  addressName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  addressPhone: {
    fontSize: 14,
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  addressText: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  itemsSection: {
    marginBottom: spacing.xl,
  },
  orderItemCard: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontSize: 12,
    color: colors.gray,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.danger,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  shopButton: {
    paddingHorizontal: spacing.xl,
  },
});

export default TrackOrderScreen; 