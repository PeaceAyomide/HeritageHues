import React from 'react';
import { Platform, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardStyleInterpolators } from '@react-navigation/stack';

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
          backgroundColor: '#080020', 
          borderTopWidth: 0,
           // Standard height for bottom tabs is typically between 50-60px
          // iOS standard is around 49px, Android material design suggests 56px
          height: Platform.OS === 'ios' ? 60 : 56,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#C0C0C0',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          borderRadius: 20,
        },
        // Disable ripple effect
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={null}
            android_disableSound={true}
            style={[props.style,  {
              // This ensures the icon is centered on both platforms
              justifyContent: 'center',
              alignItems: 'center',
            }]}
          >
            {props.children}
          </Pressable>
        ),
        // Basic animation settings
        headerShown: false,
        animationEnabled: true
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