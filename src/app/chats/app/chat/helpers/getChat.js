import axios from "axios";

export const getChat = async (conversationId) => {
  try {
    const response = await axios.get(
      `https://benifit-ai-app-be.onrender.com/api/v1/chat-history?conversationId=${conversationId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response?.data?.success) {
      throw new Error(`HTTP error! status: ${response?.status}`);
    }

    const data = response?.data?.data;

    return data;
  } catch (error) {
    console.error("Error getting chat:", error);
    return {
      success: false,
      data: null,
      message: "Failed to get chat",
    };
  }
};
