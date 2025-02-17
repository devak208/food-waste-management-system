const Ably = require('ably');
require('dotenv').config();

// Initialize Ably client
const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

// Centralized channel management
let channels = {};

const getAblyChannel = (channelName) => {
  if (!channels[channelName]) {
    channels[channelName] = ably.channels.get(channelName);
  }
  return channels[channelName];
};

// Function to broadcast messages
const broadcast = (channelName, data) => {
  try {
    const channel = getAblyChannel(channelName);
    if (!data || typeof data !== 'object') {
      throw new Error("Invalid data: must be a valid object.");
    }

    const message = JSON.stringify(data);

    console.log("Broadcasting message:", message); // Debug log
    channel.publish("update", message, (err) => {
      if (err) {
        console.error("Error broadcasting with Ably:", err.message);
      } else {
        console.log("Message broadcasted successfully:", data);
      }
    });
  } catch (error) {
    console.error("Error in broadcasting via Ably:", error);
  }
};


// Function to initialize subscriptions
const initializeAbly = (channelName, onMessageCallback) => {
  try {
    const channel = getAblyChannel(channelName);
    console.log(`Subscribed to channel: ${channelName}`);

    channel.subscribe("update", (message) => {
      try {
        console.log("Received message on Ably channel:", message);
        if (onMessageCallback) onMessageCallback(message);
      } catch (callbackError) {
        console.error("Error in message callback:", callbackError);
      }
    });

    return channel;
  } catch (error) {
    console.error("Error initializing Ably subscription:", error);
  }
};

module.exports = { initializeAbly, broadcast };
