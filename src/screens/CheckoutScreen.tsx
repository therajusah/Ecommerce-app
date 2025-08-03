import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';
import { NavigationProp } from '../types/navigation';

interface CheckoutScreenProps {
  navigation: NavigationProp;
}

interface AddressForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrder();
  
  const [address, setAddress] = useState<AddressForm>({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
  });

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

  const handlePlaceOrder = () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
      showCustomAlert(
        'Incomplete Information',
        'Please fill in all address fields to continue',
        'alert-circle',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (address.phone.length < 10) {
      showCustomAlert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number',
        'alert-circle',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (address.pincode.length !== 6) {
      showCustomAlert(
        'Invalid Pincode',
        'Please enter a valid 6-digit pincode',
        'alert-circle',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const orderData = {
      items: cart.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: getCartTotal(),
      deliveryAddress: address,
      paymentMethod: 'Cash on Delivery',
      userId: user?.id,
      userEmail: user?.email,
      status: 'confirmed' as const
    };

    const orderId = placeOrder(orderData);
    
    showCustomAlert(
      'Order Placed Successfully!',
      `Your order #${orderId} has been placed successfully. You will receive a confirmation shortly.`,
      'checkmark-circle',
      [
        {
          text: 'View Orders',
          style: 'default',
          onPress: () => {
            clearCart();
            navigation.navigate('TrackOrder');
          }
        }
      ]
    );
  };

  const total = getCartTotal();
  const gst = total * 0.18;
  const delivery = total > 500 ? 0 : 50;
  const finalTotal = total + gst + delivery;

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header 
        title="Checkout" 
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cart.items.length} items)</Text>
            <Text style={styles.summaryValue}>₹{total.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>₹{gst.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.summaryValue}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</Text>
          </View>
          {total > 500 && delivery === 0 && (
            <Text style={styles.freeDeliveryText}> You got free delivery!</Text>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal.toFixed(0)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={address.fullName}
              onChangeText={(text) => setAddress({...address, fullName: text})}
              placeholderTextColor={colors.gray}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit phone number"
              value={address.phone}
              onChangeText={(text) => setAddress({...address, phone: text})}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor={colors.gray}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Street Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="House no, Building name, Street"
              value={address.street}
              onChangeText={(text) => setAddress({...address, street: text})}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.gray}
            />
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={address.city}
                onChangeText={(text) => setAddress({...address, city: text})}
                placeholderTextColor={colors.gray}
              />
            </View>
            
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit pincode"
                value={address.pincode}
                onChangeText={(text) => setAddress({...address, pincode: text})}
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOption}>
            <Ionicons name="cash-outline" size={24} color={colors.primary} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
          <Text style={styles.paymentNote}>
            Pay with cash when your order is delivered to your doorstep
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={globalStyles.yellowButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-check-outline" size={20} color={colors.dark} />
          <Text style={[globalStyles.yellowButtonText, styles.buttonText]}>
            Place Order - ₹{finalTotal.toFixed(0)}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...globalStyles.shadow,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.primary,
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
  freeDeliveryText: {
    fontSize: 12,
    color: colors.success,
    textAlign: 'center',
    marginVertical: spacing.sm,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.dark,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
    marginBottom: spacing.md,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.lightYellow,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: spacing.md,
    color: colors.dark,
  },
  paymentNote: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buttonText: {
    marginLeft: spacing.sm,
  },
});

export default CheckoutScreen; 