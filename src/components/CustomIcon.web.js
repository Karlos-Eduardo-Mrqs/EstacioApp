// src/components/CustomIcon.web.js
import { Text } from "react-native";

export default function CustomIcon({ name, size = 20, color = "#032551" }) {
  const globalIcons = {
    "calendar-outline": "📅",
    "home-outline": "🏠",
    "search-outline": "🔍",          
    "notifications-outline": "🔔",   
    "settings-outline": "⚙️",         
    "star-outline": "⭐",
    "ribbon-outline": "🏆",
    "time-outline": "⏱️",
    "log-in-outline": "🔑",
    "person-outline": "👤",
    "lock-closed-outline": "🔒",
    "eye-outline": "👁️",
    "eye-off-outline": "🕶️",
    "alert-circle-outline": "⚠️",
    "checkmark-circle-outline": "✅",
    "information-circle-outline": "ℹ️",
    "trash-outline": "🗑️",
    "instagram": "📸",
    "logo-instagram": "📸",
    "linkedin": "💼",
    "logo-linkedin": "💼",
    "github": "😼",
    "logo-github": "😼",
    "close": "✕",
    "close-outline": "✕",
    "arrow-back": "‹",
    "book-outline": "📚",
    "library-outline": "🏛️",
    "hardware-chip-outline": "💻",
    "scale-outline": "⚖️",
    "pulse-outline": "🧠",
    "stats-chart-outline": "📊",
    "medkit-outline": "🩺",
    "code-slash-outline": "💻",
  };

  const emojiIcon = globalIcons[name] || "🔹";
  
  return (
    <Text style={{ fontSize: size, color, lineHeight: size, textAlign: 'center' }}>
      {emojiIcon}
    </Text>
  );
}