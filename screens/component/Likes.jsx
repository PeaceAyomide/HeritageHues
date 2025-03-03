import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Platform, StatusBar, ScrollView, TextInput, TouchableOpacity, Dimensions, Modal, Animated  } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import { Octicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const Likes = () => {
    const insets = useSafeAreaInsets(); // dynamically retrieves the device's safe area insets
   
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#080020] " style={{  
                     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
                }}> 
        <ScrollView className="flex-1">
 <View className="items-center justify-center gap-3">
<Header/>
</View>
</ScrollView>
    </SafeAreaView>
  )
}

export default Likes