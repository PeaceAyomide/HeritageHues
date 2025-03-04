import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './screens/Welcome';
import Tab from './screens/Tab';  
import { LikedItemsProvider } from './context/LikesContext';

const Stack = createStackNavigator();
export default function App() {
  return (
    <LikedItemsProvider>
   <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome"   options={{ headerShown: false }}  component={Welcome} />
        <Stack.Screen name="Tab"   options={{ headerShown: false }}  component={Tab} />
      </Stack.Navigator>
      <StatusBar style="light" />
   </NavigationContainer>
   </LikedItemsProvider>
  );
}
