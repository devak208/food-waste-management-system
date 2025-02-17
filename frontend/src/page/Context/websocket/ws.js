import Ably from "ably"; // Import Ably

// Log to check if the environment variable is correct
// console.log("Ably API Key:", import.meta.env.VITE_ABLY_API_KEY);

// Initialize Ably with your API key
const ably = new Ably.Realtime({ key: import.meta.env.VITE_ABLY_API_KEY });

// Initialize Ably channel
export const initializeAbly = (channelName, handleMessage) => {
  const channel = ably.channels.get(channelName);

  // Subscribe to the channel and listen for 'update' messages
  channel.subscribe("update", (message) => {
    const data = JSON.parse(message.data); // Ably sends messages as a string
    handleMessage(data); // Handle the received message
  });

  console.log("Ably channel connection established.");

  // Return the Ably channel if needed for cleanup or further interaction
  return channel;
};
