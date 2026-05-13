import { apiRequest } from "./apiClient.js";

export function sendChatMessage(message) {
  return apiRequest("/api/chat/", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export function getChatRecommendations(message) {
  return apiRequest("/api/chat/recommend/", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
