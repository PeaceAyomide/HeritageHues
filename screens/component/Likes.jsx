import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Platform, StatusBar, ScrollView, TextInput, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import { Octicons } from '@expo/vector-icons';
import { useLikes } from '../../context/LikesContext';

const Toast = ({ visible, message, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  return visible ? (
    <Animated.View
      style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        opacity: fadeAnim,
        transform: [{ translateY }],
        zIndex: 9999,
      }}
    >
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: '70%',
        justifyContent: 'center',
      }}>
        <Octicons name="trash" size={18} color="#FF4757" style={{ marginRight: 8 }} />
        <Text style={{ 
          color: 'white', 
          fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          fontSize: 15,
          fontWeight: '500' 
        }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  ) : null;
};

const Likes = () => {
  const insets = useSafeAreaInsets();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Use the combined like functions
  const { getAllLikedItemsArray, removeFromLikes } = useLikes();
  const likedClothes = getAllLikedItemsArray();

  const handleRemoveFromLikes = (itemId) => {
    const removedItem = removeFromLikes(itemId);
    if (removedItem) {
      setToastMessage(`Removed ${removedItem.name} from favorites`);
      setToastVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#080020]" style={{
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
    }}>
      <ScrollView className="flex-1">
        <View className="items-center justify-center gap-3">
          <Header />
          
          {/* Liked Items Section */}
          <View className="mt-6 w-full">
            <Text className="text-white text-lg mb-3 px-4" style={{
              fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
            }}>
              Favorite Items
            </Text>

            <View className="px-4">
              {likedClothes.length === 0 ? (
                <View className="items-center justify-center py-8">
                  <Octicons name="heart" size={50} color="#6A5ACD" style={{ marginBottom: 16 }} />
                  <Text className="text-white text-lg text-center" style={{
                    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                  }}>
                    No favorites yet
                  </Text>
                  <Text className="text-gray-400 text-center mt-2" style={{
                    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                  }}>
                    Items you like will appear here
                  </Text>
                </View>
              ) : (
                <View className="flex-row flex-wrap justify-between">
                  {likedClothes.map((item) => (
                    <View
                      key={item.id}
                      className="bg-[#1A1A2E] rounded-lg overflow-hidden mb-4"
                      style={{ width: '48%' }}
                    >
                      <View
                        style={{
                          backgroundColor: item.color,
                          height: 120,
                          width: '100%'
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => handleRemoveFromLikes(item.id)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#fff',
                          borderRadius: 20,
                          width: 36,
                          height: 36,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                      >
                        <Octicons name="trash" size={20} color="#FF4757" />
                      </TouchableOpacity>

                      <View className="p-3">
                        <Text className="text-white font-medium" style={{
                          fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                        }}>
                          {item.name}
                        </Text>
                        <Text className="text-gray-300 mt-1" style={{
                          fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                        }}>
                          {item.price}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Toast notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Likes;