import Header from './Header'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Dimensions, Platform, TouchableOpacity, StatusBar, Animated, Modal } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Octicons from 'react-native-vector-icons/Octicons'
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

// Purchase Success Modal Component
const PurchaseModal = ({ visible, item, onClose }) => {
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
          {/* Success Icon */}
          <View style={{
            backgroundColor: '#4CD964',
            width: 64,
            height: 64,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Octicons name="check" size={36} color="white" />
          </View>
          
          {/* Success Title */}
          <Text style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 12,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          }}>
            Purchase Successful!
          </Text>
          
          {/* Item Details */}
          <Text style={{
            color: 'white',
            fontSize: 16,
            marginBottom: 8,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          }}>
            {item.name} • {item.price}
          </Text>
          
          <View style={{
            backgroundColor: item.color,
            width: 60,
            height: 60,
            borderRadius: 8,
            marginVertical: 12,
          }} />
          
          <Text style={{
            color: '#8F8F9D',
            fontSize: 14,
            marginBottom: 24,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
          }}>
            Your order will be processed shortly
          </Text>
          
          {/* Close Button */}
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 30,
              width: '100%',
            }}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={{
              color: '#080020',
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
              fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif-condensed',
            }}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Home = () => {
  const insets = useSafeAreaInsets(); // dynamically retrieves the device's safe area insets
  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth - 32; // Add horizontal padding (16px on each side)
  const sliderHeight = 150; // Small height for the slider
  const scrollViewRef = useRef(null);

  // Define three slides with different background colors
  const slides = [1, 2, 3];
  const slideColors = ['#ffcccc', '#ccffcc', '#ccccff'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderInterval = 3000; // Slide interval in milliseconds

  // Use the home-specific like functions
  const { toggleHomeLike, isHomeLiked } = useLikes();

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Purchase modal state
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState(null);

  // Updated toggle like function to use home-specific context function
  const handleToggleLike = (itemId) => {
    const item = clothesData.find(item => item.id === itemId);
    toggleHomeLike(item);
    
    // Show toast when liking an item
    if (!isHomeLiked(itemId)) {
      setToastMessage(`Added ${item.name} to favorites`);
      setToastVisible(true);
    }
  };

  // Handle scroll end to update current index
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / sliderWidth);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ 
          x: nextIndex * sliderWidth, 
          animated: true 
        });
      }
      setCurrentIndex(nextIndex);
    }, sliderInterval);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length, sliderWidth]);

  // Choose different fonts based on platform
  const fontFamily = Platform.OS === 'ios' 
    ? 'Georgia' // iOS font
    : 'sans-serif-condensed'; // Android font

  // Sample clothes data with unique IDs
  const clothesData = [
    { id: 'home_1', name: 'Summer T-Shirt', price: '$24.99', color: '#FF6B6B' },
    { id: 'home_2', name: 'Denim Jeans', price: '$49.99', color: '#4ECDC4' },
    { id: 'home_3', name: 'Casual Hoodie', price: '$39.99', color: '#FFD166' },
    { id: 'home_4', name: 'Winter Jacket', price: '$89.99', color: '#6B5B95' },
    { id: 'home_5', name: 'Formal Shirt', price: '$34.99', color: '#45B7D1' },
    { id: 'home_6', name: 'Cargo Pants', price: '$44.99', color: '#98D4BB' },
  ];

  // Handle buy now button click
  const handleBuyNow = (item) => {
    setPurchasedItem(item);
    setPurchaseModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#080020] " style={{  
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
    }}>
      <ScrollView className="flex-1">
        <View className="items-center justify-center gap-3">
          <Header/>
          {/* Image Slider Section with container to control width */}
          <View className="px-4 w-full" style={{ marginTop: 20 }}>
            <View style={{ 
              height: sliderHeight, 
              width: '100%',
              borderRadius: 8,
              overflow: 'hidden' // Ensures content doesn't overflow rounded corners
            }}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                decelerationRate="fast"
              >
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: sliderWidth,
                      height: sliderHeight,
                      backgroundColor: slideColors[index]
                    }}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Dot Indicators */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    marginHorizontal: 3
                  }}
                />
              ))}
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-white text-lg mb-3 px-4">
              Clothes On Sale
            </Text>
            
            <View className="px-4">
              <View className="flex-row flex-wrap justify-between">
                {clothesData.map((item) => (
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
                    {/* Like button positioned at top left corner */}
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
                        name={isHomeLiked(item.id) ? "heart-fill" : "heart"} 
                        size={20} 
                        color={isHomeLiked(item.id) ? "#FF4757" : ""} 
                      />
                    </TouchableOpacity>
                    
                    <View className="p-3">
                      <Text className="text-white font-medium">{item.name}</Text>
                      <Text className="text-gray-300 mt-1">{item.price}</Text>
                      
                      <TouchableOpacity 
                        className="bg-[#F2F2F2] py-2 rounded-md mt-2 items-center"
                        activeOpacity={0.7}
                        onPress={() => handleBuyNow(item)}
                      >
                        <Text className="text-[#080020] font-medium">Buy Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
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
      {/* Purchase success modal */}
      <PurchaseModal
        visible={purchaseModalVisible}
        item={purchasedItem}
        onClose={() => setPurchaseModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default Home