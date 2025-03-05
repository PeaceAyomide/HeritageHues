import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, AppState } from 'react-native';
import { getPushDataObject, getNotificationInbox } from 'native-notify';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Create the notification context
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationsViewed, setNotificationsViewed] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);

  // Register for push notifications and set up listeners
  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then(token => {
      console.log('Expo Push Token:', token);
      setExpoPushToken(token);
    });

    // Set up AppState listener to refresh notifications when app comes to foreground
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // Fetch notifications when app comes to foreground
        fetchNotificationInbox();
      }
      appState.current = nextAppState;
    });

    // Handle notifications that are received while the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      setNotification(notification);
      
      // Extract notification data
      const { title, body } = notification.request.content;
      const data = notification.request.content.data;
      
      // Add to local notifications state
      const newNotification = {
        id: Date.now().toString(),
        title: title || 'New Notification',
        message: body || 'You have a new notification',
        time: 'Just now',
        data
      };
      
      addNotification(newNotification);
    });

    // Handle notification when the user taps on it
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;
      
      // Check if the app is already in the foreground
      if (appState.current === 'active') {
        console.log('App is already in foreground, ignoring notification tap');
        return; // Don't process the notification tap if app is already open
      }
      
      // Add the tapped notification to our local state if it's not already there
      const { title, body } = response.notification.request.content;
      const newNotification = {
        id: `tapped-${Date.now()}`,
        title: title || 'New Notification',
        message: body || 'You have a new notification',
        time: 'Just now',
        data
      };
      
      // Check if this notification is already in our state
      const notificationExists = notifications.some(
        n => n.title === newNotification.title && n.message === newNotification.message
      );
      
      if (!notificationExists) {
        addNotification(newNotification);
      }
      
      // Set notifications as unviewed so the red dot appears
      setNotificationsViewed(false);
    });

    // Set up background notification handler
    Notifications.setNotificationCategoryAsync('default', [
      {
        identifier: 'default',
        buttonTitle: 'Open',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);

    // Initial fetch of notifications
    fetchNotificationInbox();

    // Clean up subscriptions
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      appStateSubscription.remove();
    };
  }, []);

  // Function to add a new notification
  const addNotification = (notification) => {
    setNotifications(prevNotifications => [notification, ...prevNotifications]);
    setNotificationsViewed(false); // Mark as unviewed when new notification arrives
  };

  // Function to delete a notification
  const deleteNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(item => item.id !== id)
    );
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Function to fetch notifications from Native Notify inbox
  const fetchNotificationInbox = async () => {
    try {
      // Use the actual App ID from App.js
      const appId = 27994;
      // Use the expoPushToken as the subId if available, otherwise use a default
      const subId = expoPushToken || 'user123'; 
      
      // Try to fetch the notification inbox without waiting
      getNotificationInbox(appId, subId)
        .then(inbox => {
          if (inbox && inbox.length > 0) {
            const formattedInbox = inbox.map(item => ({
              id: item.notification_id.toString(),
              title: item.title || 'Notification',
              message: item.message || '',
              time: new Date(item.created_at).toLocaleString(),
              data: item.data || {}
            }));
            
            setNotifications(formattedInbox);
          }
        })
        .catch(error => {
          // Log the error but don't show it to the user if it's a 401
          if (error.response && error.response.status === 401) {
            console.log('Authentication error with Native Notify inbox. This is normal if you haven\'t set up inbox access.');
          } else {
            console.error('Error fetching notification inbox:', error);
          }
        });
    } catch (error) {
      console.error('Error in fetchNotificationInbox:', error);
    }
  };

  // Function to mark notifications as viewed
  const markNotificationsAsViewed = () => {
    setNotificationsViewed(true);
  };

  // Check if there are any notifications
  const hasNotifications = notifications.length > 0;
  
  // Check if there are any unviewed notifications
  const hasUnviewedNotifications = hasNotifications && !notificationsViewed;

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        hasNotifications,
        hasUnviewedNotifications,
        expoPushToken,
        addNotification,
        deleteNotification,
        clearAllNotifications,
        fetchNotificationInbox,
        markNotificationsAsViewed
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}