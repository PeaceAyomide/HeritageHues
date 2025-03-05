import React, { useEffect } from 'react';
import { View, Text, ScrollView, Platform, StatusBar, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../../context/NotificationContext';

const Notification = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { 
    notifications, 
    deleteNotification, 
    clearAllNotifications,
    fetchNotificationInbox,
    markNotificationsAsViewed
  } = useNotifications();
  
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch notifications and mark as viewed immediately when component mounts
  useEffect(() => {
    // Fetch notifications without any loading state
    fetchNotificationInbox();
    markNotificationsAsViewed();
    
    // Set up a focus listener to refresh notifications when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotificationInbox();
      markNotificationsAsViewed();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Handle pull-to-refresh without delays
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNotificationInbox();
    markNotificationsAsViewed();
    setRefreshing(false);
  }, [fetchNotificationInbox, markNotificationsAsViewed]);

  const renderNotificationItem = ({ item }) => (
    <View className="bg-[#1a1a30] rounded-lg p-4 mb-3">
      <View className="flex-row justify-between">
        <Text className="text-white font-bold">{item.title}</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-xs mr-3">{item.time}</Text>
          <TouchableOpacity 
            onPress={() => deleteNotification(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="delete-outline" size={20} color="#FF4757" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-gray-300 mt-1">{item.message}</Text>
      {item.data && Object.keys(item.data).length > 0 && (
        <TouchableOpacity 
          className="mt-2 bg-[#2a2a40] p-2 rounded" 
          onPress={() => {
            // Handle any action based on notification data
            console.log('Notification data:', item.data);
            // For example, navigate to a specific screen based on data
            if (item.data.screen) {
              navigation.navigate(item.data.screen, item.data.params);
            }
          }}
        >
          <Text className="text-[#6A5ACD]">View Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#080020]" style={{
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
    }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#fff" 
            onPress={() => navigation.goBack()} 
            style={{ marginRight: 15 }}
          />
          <Text className="text-white text-xl font-bold">Notifications</Text>
        </View>
        
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications}>
            <Text className="text-[#6A5ACD] font-medium">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6A5ACD"
            colors={['#6A5ACD']}
          />
        }
      >
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="notifications-off-outline" size={60} color="#6c6c7d" />
            <Text className="text-white text-lg mt-4">No notifications yet</Text>
            <Text className="text-gray-400 text-center mt-2">
              When you get notifications, they'll show up here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;