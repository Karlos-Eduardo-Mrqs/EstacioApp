// src/components/CustomIcon.js
import { Text } from "react-native";

export default function CustomIcon({ name, size = 20, color = "#032551" }) {
  // Dicionário global de ícones/emojis para funcionar perfeitamente em Web e Mobile sem depender de fontes externas
  const globalIcons = {
    // Ícones principais do aplicativo para o TabBar e outras seções
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
    
    //icones de olho para visibilidade
    "eye-outline": "👁️",
    "eye-off-outline": "🕶️",
    
    // Ícones de alerta e feedback
    "alert-circle-outline": "⚠️",
    "checkmark-circle-outline": "✅",
    "information-circle-outline": "ℹ️",
    "trash-outline": "🗑️",

    // Redes Sociais solicitadas
    "instagram": "📸",
    "logo-instagram": "📸",
    "linkedin": "💼",
    "logo-linkedin": "💼",
    "github": "😼",
    "logo-github": "😼",

    // No seu CustomIcon.js, adicione:
    "close": "✕",
    "close-outline": "✕",
    "arrow-back": "<",
  
  };

  const emojiIcon = globalIcons[name] || "🔹";

  return (
    <Text style={{ fontSize: size, color, lineHeight: size, textAlign: 'center' }}>
      {emojiIcon}
    </Text>
  );
}