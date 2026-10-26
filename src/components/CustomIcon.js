import { Text, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';

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
    'code-slash-outline': 'code-slash-outline',
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
    "book-outline": "📚",
    "library-outline": "🏛️",
    "hardware-chip-outline": "💻",
    "scale-outline": "⚖️",
    "pulse-outline": "🧠",
    "stats-chart-outline": "📊",
    "medkit-outline": "🩺",
    "code-slash-outline": "💻",
  };

  // 🌐 NO WEB (Nuvem / Browser): Renderiza diretamente os símbolos/emojis
  // Evita o erro 404 e falhas de carregamento de fontes .ttf nas hospedagens estáticas (Firebase, Vercel, etc.)
  if (Platform.OS === 'web') {
    const symbolIcon = globalIcons[name] || "🔹";
    return (
      <Text style={{ fontSize: size, color, lineHeight: size, textAlign: 'center' }}>
        {symbolIcon}
      </Text>
    );
  }

  // 📱 NO MOBILE (App Nativo / Expo Go): Utiliza os vetores do Ionicons com segurança
  const iconName = iconMap[name];
  if (iconName) {
    try {
      return <Ionicons name={iconName} size={size} color={color} />;
    } catch (e) {
      // Ignora e cai no fallback caso ocorra algum imprevisto
    }
  }

  const emojiIcon = globalIcons[name] || "🔹";
  return (
    <Text style={{ fontSize: size, color, lineHeight: size, textAlign: 'center' }}>
      {emojiIcon}
    </Text>
  );
}