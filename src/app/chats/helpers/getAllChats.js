import axios from "axios";

export const getAllChats = async () => {
  try {
    const response = await axios.post(
      "https://benifit-ai-app-be.onrender.com/api/v1/get-user",
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
    console.error("Error sending message:", error);
    return {
      success: false,
      data: null,
      message: "Failed to send message",
    };
  }
};
