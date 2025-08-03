import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';
import { NavigationProp } from '../types/navigation';

interface EditProfileScreenProps {
  navigation: NavigationProp;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
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

  const handleSaveProfile = () => {
    if (!formData.name || !formData.email) {
      showCustomAlert(
        'Error',
        'Please fill in required fields (Name and Email)',
        'alert-circle',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (!formData.email.includes('@')) {
      showCustomAlert(
        'Invalid Email',
        'Please enter a valid email address',
        'alert-circle',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    showCustomAlert(
      'Profile Updated',
      'Your profile has been updated successfully!',
      'checkmark-circle',
      [{ text: 'OK', style: 'default', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Edit Profile" 
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.photoButton} activeOpacity={0.8}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.photoText}>Tap to change photo</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={colors.gray} />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.gray} />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={colors.gray} />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Ionicons name="location-outline" size={20} color={colors.gray} style={styles.textAreaIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={globalStyles.yellowButton}
          onPress={handleSaveProfile}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.dark} />
          <Text style={[globalStyles.yellowButtonText, styles.saveButtonText]}>
            Save Changes
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
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  photoSection: {
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightGray,
    borderWidth: 3,
    borderColor: colors.yellow,
  },
  photoButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: '40%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  photoText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: spacing.md,
  },
  formSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.dark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    minHeight: 50,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingTop: spacing.md,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    fontSize: 16,
    color: colors.dark,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButtonText: {
    marginLeft: spacing.sm,
  },
});

export default EditProfileScreen; 