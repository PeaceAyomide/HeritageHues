import React from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { Octicons } from '@expo/vector-icons'

const Header = () => {

    // Choose different fonts based on platform
      const fontFamily = Platform.OS === 'ios' 
        ? 'Georgia' // iOS font
        : 'sans-serif-condensed'; // Android font

  return (
    <View className=" flex-row mt-4 items-center justify-between w-full px-4">
              <Text className="text-white text-3xl" style={{ fontFamily }}>
                HeritageHues
              </Text>
              <TouchableOpacity hitSlop={40}>
                <Octicons name="bell" size={25} color="#fff" /></TouchableOpacity>
    
            </View>
  )
}

export default Header