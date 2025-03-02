import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';

const Welcome = ({ navigation }) => {
   
  // Choose different fonts based on platform
  const fontFamily = Platform.OS === 'ios' 
    ? 'Georgia' // iOS font
    : 'sans-serif-condensed'; // Android font

  return (
    <View className="flex-1 bg-[#080020]">
      {/* Main content centered in the screen */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-3xl" style={{ fontFamily }}>
          HeritageHues
        </Text>
        
      </View>
      
      {/* Continue button fixed at the bottom */}
      <TouchableOpacity 
        className="items-center pb-10 pt-4"
        onPress={() => navigation.navigate('Tab')}
      >
        <Text className="text-white text-lg" style={{ fontFamily }}>
          Continue →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;