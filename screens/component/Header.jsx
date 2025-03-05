import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform, AppState } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useNotifications } from '../../context/NotificationContext'

const Header = () => {
  const navigation = useNavigation();
  const { 
    hasUnviewedNotifications, 
    fetchNotificationInbox, 
    markNotificationsAsViewed 
  } = useNotifications();
  
  // Set up AppState listener to refresh notifications when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // Refresh notifications when app comes to foreground
        fetchNotificationInbox();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchNotificationInbox]);

  // Choose different fonts based on platform
  const fontFamily = Platform.OS === 'ios' 
    ? 'Georgia' // iOS font
    : 'sans-serif-condensed'; // Android font

  // Handle notification icon press
  const handleNotificationPress = () => {
    markNotificationsAsViewed(); // Mark notifications as viewed when navigating to the notification screen
    navigation.navigate('Notification');
  };

  return (
    <View className="flex-row mt-4 items-center justify-between w-full px-4">
      <Text className="text-white text-3xl" style={{ fontFamily }}>
        HeritageHues
      </Text>
      <TouchableOpacity 
        hitSlop={40} 
        onPress={handleNotificationPress}
        style={{ position: 'relative' }}
      >
        <Octicons name="bell" size={25} color="#fff" />
        {hasUnviewedNotifications && (
          <View 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#FF4757',
              borderWidth: 1,
              borderColor: '#080020',
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

export default Header