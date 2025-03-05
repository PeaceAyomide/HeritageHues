import Header from './Header'
import React, { useState } from 'react'
import { View, Text, ScrollView, Platform, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const Profile = () => {
    const insets = useSafeAreaInsets(); // dynamically retrieves the device's safe area insets
    const [gender, setGender] = useState('Female');
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
 
    return (
        <SafeAreaView className="flex-1 bg-[#080020]" style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
          }}>
            <ScrollView className="flex-1">
              <View className="items-center justify-center gap-3">
                <Header />
                
                {/* Profile Header Section - Row layout aligned to left */}
                <View className="w-full px-5 mt-6 mb-2">
                  <View className="flex-row items-center">
                    <View className="h-16 w-16 rounded-full bg-white justify-center items-center overflow-hidden mr-4">
                      {/* Profile Image Placeholder */}
                      <View className="bg-[#d3d3d3] h-full w-full"></View>
                    </View>
                    <View>
                      <Text className="text-white text-xl font-bold">User</Text>
                      <Text className="text-gray-400">example@gmail.com</Text>
                    </View>
                  </View>
                </View>
                
                {/* Form Fields */}
                <View className="w-full gap-4 px-5 space-y-4">
                  {/* Name Field */}
                  <View>
                    <Text className="text-gray-400 mb-2">Name</Text>
                    <View className="bg-[#1a1a30] rounded-lg flex-row items-center px-3 "style={{paddingVertical:Platform.OS === 'ios' ?  12 :  5}}>
                      <Ionicons name="person-outline" size={20} color="#6c6c7d" />
                      <TextInput 
                        className="flex-1 text-white ml-3"
                        placeholder="Samuel Bishop"
                        placeholderTextColor="#fff"
                        value="User Name"
                        editable={false}
                      />
                    </View>
                  </View>
                  
                  {/* Email Field */}
                  <View>
                    <Text className="text-gray-400 mb-2">Email</Text>
                    <View className="bg-[#1a1a30] rounded-lg flex-row items-center px-3 " style={{paddingVertical:Platform.OS === 'ios' ?  12 :  5}}>
                      <MaterialCommunityIcons name="email-outline" size={20} color="#6c6c7d" />
                      <TextInput 
                        className="flex-1 text-white ml-3"
                        placeholder="example@gmail.com"
                        placeholderTextColor="#fff"
                        value="example@gmail.com"
                        editable={false}
                      />
                    </View>
                  </View>
                  
                  {/* Contact Field */}
                  <View>
                    <Text className="text-gray-400 mb-2">Contact</Text>
                    <View className="bg-[#1a1a30] rounded-lg flex-row items-center px-3 " style={{paddingVertical:Platform.OS === 'ios' ?  12 :  5}}>
                      <Feather name="phone" size={20} color="#6c6c7d" />
                      <TextInput 
                        className="flex-1 text-white ml-3"
                        placeholder="(760) 895-4146 78985"
                        placeholderTextColor="#fff"
                        value="(760) 895-4146 78985"
                        editable={false}
                      />
                    </View>
                  </View>
                  
                  {/* Gender Field */}
                  <View>
                    <Text className="text-gray-400 mb-2">Gender</Text>
                    <TouchableOpacity 
                      className="bg-[#1a1a30] rounded-lg flex-row items-center justify-between px-3 py-3"
                      onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="male-female-outline" size={20} color="#6c6c7d" />
                        <Text className="text-white ml-3">{gender}</Text>
                      </View>
                      <Ionicons name="chevron-down" size={20} color="#6c6c7d" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Date of Birth Field */}
                  <View>
                    <Text className="text-gray-400 mb-2">Date of birth</Text>
                    <View className="bg-[#1a1a30] rounded-lg flex-row items-center justify-between px-3 py-3">
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={20} color="#6c6c7d" />
                        <Text className="text-white ml-3">24-01-2000</Text>
                      </View>
                      <Ionicons name="calendar" size={20} color="#6c6c7d" />
                    </View>
                  </View>
                  
                  {/* Add more fields as needed */}
                </View>
              </View>
            </ScrollView>
        </SafeAreaView>      
    );
};

export default Profile;