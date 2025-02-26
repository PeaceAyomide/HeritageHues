import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Importing screen components
import Home from './component/Home';
import Search from './component/Search';
import Likes from './component/Likes';
import Profile from './component/Profile';

const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#080020', // Custom background color for the tab bar
          borderTopWidth: 0,
          height: 84,
        },
        tabBarActiveTintColor: '#fff', // Color for the active tab icon/text
        tabBarInactiveTintColor: '#C0C0C0', // Color for inactive tab icon/text
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? "home-sharp" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? "search-sharp" : "search-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Likes" 
        component={Likes}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? "heart" : "heart-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;