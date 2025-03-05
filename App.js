import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './screens/Welcome';
import Tab from './screens/Tab';  
import { LikedItemsProvider } from './context/LikesContext';
import { NotificationProvider } from './context/NotificationContext';
import registerNNPushToken from 'native-notify';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();
export default function App() {
  // Register with Native Notify - replace these with your actual App ID and Token from NativeNotify.com
  registerNNPushToken(27994, 'JE77h0BsOYLLCPydEphbQE');
  
  const notificationListener = useRef();
  const responseListener = useRef();
  const appStateRef = useRef(AppState.currentState);
  
  useEffect(() => {
    // Set up AppState listener to track when app is in foreground
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      appStateRef.current = nextAppState;
    });
    
    // This listener is for when the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // This listener is for when the user taps on a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      
      // Check if the app is already in the foreground
      if (appStateRef.current === 'active') {
        console.log('App is already in foreground, ignoring notification tap in App.js');
        return; // Don't process the notification tap if app is already open
      }
      
      // The app will automatically open when a notification is tapped
      // but we won't take any additional action if the app is already open
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      appStateSubscription.remove();
    };
  }, []);
  
  return (
    <NotificationProvider>
      <LikedItemsProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
            <Stack.Screen name="Tab" options={{ headerShown: false }} component={Tab} />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </LikedItemsProvider>
    </NotificationProvider>
  );
}
