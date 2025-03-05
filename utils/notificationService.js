// utils/notificationService.js
import { sendNotification, getPushDataObject } from 'native-notify';

// Updated with your actual app ID and token from App.js
const APP_ID = 27994;
const APP_TOKEN = 'JE77h0BsOYLLCPydEphbQE';

/**
 * Send a push notification to a specific user
 * @param {string} subId - Subscriber ID (usually the user ID)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} data - Optional data to include with the notification
 */
export const sendPushNotification = (subId, title, message, data = {}) => {
  sendNotification(
    APP_ID, 
    APP_TOKEN,
    subId,
    title,
    message,
    getPushDataObject(data)
  );
};

/**
 * Send a push notification to all users
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} data - Optional data to include with the notification
 */
export const sendBroadcastNotification = (title, message, data = {}) => {
  // Use 'all' as the subId to send to all users
  sendNotification(
    APP_ID, 
    APP_TOKEN,
    'all',
    title,
    message,
    getPushDataObject(data)
  );
};

/**
 * Schedule a push notification for a future time
 * @param {string} subId - Subscriber ID (usually the user ID)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Date} scheduledTime - When to send the notification
 * @param {object} data - Optional data to include with the notification
 */
export const scheduleNotification = (subId, title, message, scheduledTime, data = {}) => {
  // Convert date to seconds since epoch
  const secondsSinceEpoch = Math.floor(scheduledTime.getTime() / 1000);
  
  sendNotification(
    APP_ID, 
    APP_TOKEN,
    subId,
    title,
    message,
    getPushDataObject({
      ...data,
      scheduled: true,
      scheduled_time: secondsSinceEpoch
    })
  );
};