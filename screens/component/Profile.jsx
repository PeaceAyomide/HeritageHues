import Header from './Header'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Dimensions, Platform, TouchableOpacity, StatusBar, Animated, Modal } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Octicons from 'react-native-vector-icons/Octicons'


const Profile = () => {
    const insets = useSafeAreaInsets(); // dynamically retrieves the device's safe area insets
 
    return (
        <SafeAreaView className="flex-1 bg-[#080020]" style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
          }}>
            <ScrollView className="flex-1">
              <View className="items-center justify-center gap-3">
                <Header />
                </View>
                </ScrollView>
      </SafeAreaView>      
    );
};


export default Profile;