// context/LikesContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LikesContext = createContext();

export const useLikes = () => useContext(LikesContext);

export const LikedItemsProvider = ({ children }) => {
  // Separate state for home and search screens
  const [homeLikedItems, setHomeLikedItems] = useState({});
  const [searchLikedItems, setSearchLikedItems] = useState({});
  
  // Toggle like status for home screen items
  const toggleHomeLike = (item) => {
    setHomeLikedItems(prev => {
      const newLikedItems = { ...prev };
      if (newLikedItems[item.id]) {
        delete newLikedItems[item.id];
      } else {
        newLikedItems[item.id] = { ...item, timestamp: Date.now() };
      }
      return newLikedItems;
    });
  };
  
  // Toggle like status for search screen items
  const toggleSearchLike = (item) => {
    setSearchLikedItems(prev => {
      const newLikedItems = { ...prev };
      if (newLikedItems[item.id]) {
        delete newLikedItems[item.id];
      } else {
        newLikedItems[item.id] = { ...item, timestamp: Date.now() };
      }
      return newLikedItems;
    });
  };
  
  // Check if a home item is liked
  const isHomeLiked = (itemId) => {
    return Boolean(homeLikedItems[itemId]);
  };
  
  // Check if a search item is liked
  const isSearchLiked = (itemId) => {
    return Boolean(searchLikedItems[itemId]);
  };
  
  // Get all liked items as an array (for Likes screen)
  const getAllLikedItemsArray = () => {
    // Combine both home and search liked items and sort by timestamp
    return [...Object.values(homeLikedItems), ...Object.values(searchLikedItems)]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort by timestamp, newest first
  };
  
  // Remove an item from likes (used in Likes screen)
  const removeFromLikes = (itemId) => {
    // Check if item exists in home likes
    if (homeLikedItems[itemId]) {
      setHomeLikedItems(prev => {
        const newLikedItems = { ...prev };
        delete newLikedItems[itemId];
        return newLikedItems;
      });
      return homeLikedItems[itemId]; // Return the removed item
    }
    
    // Check if item exists in search likes
    if (searchLikedItems[itemId]) {
      setSearchLikedItems(prev => {
        const newLikedItems = { ...prev };
        delete newLikedItems[itemId];
        return newLikedItems;
      });
      return searchLikedItems[itemId]; // Return the removed item
    }
    
    return null; // Item not found
  };
  
  return (
    <LikesContext.Provider 
      value={{ 
        // Home screen functions
        toggleHomeLike,
        isHomeLiked,
        homeLikedItems,
        
        // Search screen functions
        toggleSearchLike,
        isSearchLiked,
        searchLikedItems,
        
        // Likes screen functions
        getAllLikedItemsArray,
        removeFromLikes
      }}
    >
      {children}
    </LikesContext.Provider>
  );
};