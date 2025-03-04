import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Platform, StatusBar, ScrollView, TextInput, TouchableOpacity, Dimensions, Modal, Animated  } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import { Feather, Octicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import { useLikes } from '../../context/LikesContext';

// Toast Component
const Toast = ({ visible, message, onHide }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-50)).current;
  
    useEffect(() => {
      if (visible) {
        // Fade in and slide down
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
  
        // Auto hide after 2.5 seconds
        const timer = setTimeout(() => {
          hideToast();
        }, 2500);
  
        return () => clearTimeout(timer);
      }
    }, [visible]);
  
    const hideToast = () => {
      // Fade out and slide up
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
  
    return (
      visible && (
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
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Octicons name="heart-fill" size={18} color="#FF4757" style={{ marginRight: 8 }} />
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
      )
    );
  };
  
// Item Detail Modal Component
const ItemDetailModal = ({ visible, item, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal is hidden
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!item) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}>
        <Animated.View style={{
          backgroundColor: '#1A1A2E',
          borderRadius: 16,
          padding: 24,
          width: '80%',
          maxWidth: 340,
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}>
          {/* Item Image (color block) */}
          <View style={{
            backgroundColor: item.color,
            width: '100%',
            height: 150,
            borderRadius: 8,
            marginBottom: 20,
          }} />
          
          {/* Item Name */}
          <Text style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 12,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          }}>
            {item.name}
          </Text>
          
          {/* Item Price */}
          <Text style={{
            color: 'white',
            fontSize: 18,
            marginBottom: 16,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          }}>
            {item.price}
          </Text>
          
          {/* Item Category */}
          <View style={{
            backgroundColor: '#6A5ACD',
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 20,
            marginBottom: 20,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
            }}>
              {item.category}
            </Text>
          </View>
          
          {/* Item Description (placeholder) */}
          <Text style={{
            color: '#8F8F9D',
            fontSize: 14,
            marginBottom: 24,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          }}>
            This stylish {item.name.toLowerCase()} is perfect for any occasion. Made with premium materials for comfort and durability.
          </Text>
          
          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}>
            {/* Close Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#140D2B',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 30,
                width: '48%',
              }}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={{
                color: 'white',
                fontSize: 15,
                fontWeight: '600',
                textAlign: 'center',
                fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
              }}>
                Close
              </Text>
            </TouchableOpacity>
            
            
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};


const Search = () => {
    const insets = useSafeAreaInsets(); // dynamically retrieves the device's safe area insets
    const [searchQuery, setSearchQuery] = useState('');
    // Use the search-specific like functions
    const { toggleSearchLike, isSearchLiked } = useLikes();
    
// Modal state for item details
const [detailModalVisible, setDetailModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

// Toast state
const [toastVisible, setToastVisible] = useState(false);
const [toastMessage, setToastMessage] = useState('');

    // Sample suggested clothes data with unique IDs
    const suggestedClothes = [
        { id: 'search_1', name: 'Casual Shirt', category: 'Tops', price: '$19.99', color: '#6A5ACD' },
        { id: 'search_2', name: 'Slim Fit Jeans', category: 'Bottoms', price: '$34.99', color: '#4169E1' },
        { id: 'search_3', name: 'Summer Dress', category: 'Dresses', price: '$29.99', color: '#FF69B4' },
        { id: 'search_4', name: 'Leather Jacket', category: 'Outerwear', price: '$79.99', color: '#8B4513' },
        { id: 'search_5', name: 'Graphic Tee', category: 'Tops', price: '$14.99', color: '#20B2AA' },
        { id: 'search_6', name: 'Athletic Shorts', category: 'Bottoms', price: '$24.99', color: '#FF6347' },
    ];

// Categories for filtering
const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear'];
const [activeCategory, setActiveCategory] = useState('All');

// Updated toggle like function to use search-specific context function
const handleToggleLike = (itemId) => {
    const item = suggestedClothes.find(item => item.id === itemId);
    toggleSearchLike(item);
    
    // Show toast when liking an item
    if (!isSearchLiked(itemId)) {
        const item = suggestedClothes.find(item => item.id === itemId);
        setToastMessage(`Added ${item.name} to favorites`);
        setToastVisible(true);
    }
};

// Clear search query
const clearSearch = () => {
    setSearchQuery('');
};

// Handle view details button click
const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
};

 // Filter items based on active category and search query
 const filteredItems = suggestedClothes.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
});


    return (
        <SafeAreaView className="flex-1 bg-[#080020] " style={{  
                 paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
            }}>
 <ScrollView className="flex-1">
 <View className="items-center justify-center gap-3">
<Header/>
 {/* Search input with icon */}
 <View className="px-4">
 <View 
                        className="w-full flex-row items-center rounded-md mt-4 bg-[#140D2B]"
                        style={{
                            backgroundColor: '#140D2B',
                            
                            paddingHorizontal: 10,
                            paddingVertical: 8
                        }}
                    >
                        <Feather name="search" size={20} color="white" style={{ marginRight: 8 }} />
                        <TextInput
                            style={{ flex: 1, color: 'white' }}
                            underlineColorAndroid="transparent"
                            placeholder='Search here'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={'#8D8D8D'}
                        />
                    </View>
 </View>
   {/* Category Filters */}
   <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                onPress={() => setActiveCategory(category)}
                                style={{
                                    backgroundColor: activeCategory === category ? '#6A5ACD' : '#1A1A2E',
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    marginRight: 8
                                }}
                            >
                                <Text style={{ 
                                    color: 'white',
                                    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                                }}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                     {/* Cloth Suggested */}
                     <View className="mt-4 w-full">
                        <Text className="text-white text-lg mb-3 px-4" style={{
                            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                        }}>
                            Cloth Suggested
                        </Text>
                        
                        <View className="px-4">
                            <View className="flex-row flex-wrap justify-between">
                                {filteredItems.map((item) => (
                                    <View 
                                        key={item.id} 
                                        className="bg-[#1A1A2E] rounded-lg overflow-hidden mb-4"
                                        style={{ width: '48%' }}
                                    >
                                        {/* Color block representing the clothing image */}
                                        <View 
                                            style={{ 
                                                backgroundColor: item.color,
                                                height: 120,
                                                width: '100%'
                                            }} 
                                        />
                                        {/* Like button positioned at top right corner */}
                                        <TouchableOpacity 
                                            onPress={() => handleToggleLike(item.id)}
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
                                            <Octicons 
                                                name={isSearchLiked(item.id) ? "heart-fill" : "heart"} 
                                                size={20} 
                                                color={isSearchLiked(item.id) ? "#FF4757" : ""} 
                                            />
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
                                           
                                            <TouchableOpacity 
                                                className="bg-[#F2F2F2] py-2 rounded-md mt-2 items-center"
                                                activeOpacity={0.7}
                                                onPress={() => handleViewDetails(item)}
                                            >
                                                <Text className="text-[#080020] font-medium" style={{
                                                    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                                                }}>
                                                    View Details
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            
                            {filteredItems.length === 0 && (
                                <View className="items-center justify-center py-8">
                                    <Feather name="search" size={50} color="#6A5ACD" style={{ marginBottom: 16 }} />
                                    <Text className="text-white text-lg text-center" style={{
                                        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                                    }}>
                                        No items found
                                    </Text>
                                    <Text className="text-gray-400 text-center mt-2" style={{
                                        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
                                    }}>
                                        Try a different search or category
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
 </View>
 </ScrollView>
 {/* Item Detail Modal */}
 <ItemDetailModal
                visible={detailModalVisible}
                item={selectedItem}
                onClose={() => setDetailModalVisible(false)}
            />
            {/* Toast notification */}
            <Toast 
                visible={toastVisible} 
                message={toastMessage} 
                onHide={() => setToastVisible(false)} 
            />
            </SafeAreaView>
         
        
    );
};

export default Search;