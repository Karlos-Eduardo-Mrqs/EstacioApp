// src/components/CustomIcon.js
import { Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

// 🎨 Função centralizada para definir o ícone personalizado de acordo com o nome do curso
export const obterIconeCurso = (nomeCurso) => {
  const nome = nomeCurso?.toLowerCase() || "";
  
  const mapaIcones = {
    "computação": "hardware-chip-outline",
    "ti": "hardware-chip-outline",
    "sistema": "hardware-chip-outline",
    "informática": "hardware-chip-outline",
    "direito": "scale-outline",
    "psicologia": "pulse-outline",
    "administração": "stats-chart-outline",
    "gestão": "stats-chart-outline",
    "enfermagem": "medkit-outline",
    "saúde": "medkit-outline",
  };

  for (const [chave, icone] of Object.entries(mapaIcones)) {
    if (nome.includes(chave)) {
      return icone;
    }
  }
  
  return "book-outline"; // Ícone padrão genérico
};

export default function CustomIcon({ name, size = 20, color = "#032551" }) {
  
  const iconMap = {
    'settings-outline': 'settings-outline',
    'settings': 'settings',
    'calendar-outline': 'calendar-outline',
    'calendar': 'calendar',
    'home-outline': 'home-outline',
    'home': 'home',
    'search-outline': 'search-outline',
    'search': 'search',
    'notifications-outline': 'notifications-outline',
    'bell': 'notifications',
    'star-outline': 'star-outline',
    'star': 'star',
    'ribbon-outline': 'ribbon-outline',
    'ribbon': 'ribbon',
    'time-outline': 'time-outline',
    'clock': 'time',
    'log-in-outline': 'log-in-outline',
    'person-outline': 'person-outline',
    'user': 'person',
    'lock-closed-outline': 'lock-closed-outline',
    'lock': 'lock-closed',
    'eye-outline': 'eye-outline',
    'eye': 'eye',
    'eye-off-outline': 'eye-off-outline',
    'eye-off': 'eye-off',
    'alert-circle-outline': 'alert-circle-outline',
    'checkmark-circle-outline': 'checkmark-circle-outline',
    'information-circle-outline': 'information-circle-outline',
    'info': 'information-circle',
    'trash-outline': 'trash-outline',
    'trash': 'trash',
    'instagram': 'logo-instagram',
    'logo-instagram': 'logo-instagram',
    'linkedin': 'logo-linkedin',
    'logo-linkedin': 'logo-linkedin',
    'github': 'logo-github',
    'logo-github': 'logo-github',
    'close': 'close',
    'close-outline': 'close-outline',
    'arrow-back': 'arrow-back',
    'book-outline': 'book-outline',
    'book': 'book',
    'library-outline': 'library-outline',
    'library': 'library',
    'hardware-chip-outline': 'hardware-chip-outline',
    'scale-outline': 'scale-outline',
    'pulse-outline': 'pulse-outline',
    'stats-chart-outline': 'stats-chart-outline',
    'medkit-outline': 'medkit-outline',
  };

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
    "hardware-chip-outline": "💻",
    "scale-outline": "⚖️",
    "pulse-outline": "🧠",
    "stats-chart-outline": "📊",
    "medkit-outline": "🩺",
  };

  const iconName = iconMap[name];

  if (iconName) {
    return <Ionicons name={iconName} size={size} color={color} />;
  }

  const emojiIcon = globalIcons[name] || "🔹";
  return (
    <Text style={{ fontSize: size, color, lineHeight: size, textAlign: 'center' }}>
      {emojiIcon}
    </Text>
  );
}