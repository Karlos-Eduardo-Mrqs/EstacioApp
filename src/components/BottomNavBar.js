import { TouchableOpacity, View } from "react-native";
import { CoresInstitucionais } from "../styles/theme";
import { bottomNavBarstyles as styles } from "../styles/bottomNavBarStyles";
import CustomIcon from "./CustomIcon";

export default function BottomNavBar({ activeTab, onTabPress }) {
  const tabs = [
    { id: "mural", name: "calendar-outline", label: "Mural" },
    { id: "busca", name: "search-outline", label: "Busca" },
    { id: "notificacoes", name: "notifications-outline", label: "Avisos" },
    { id: "configuracoes", name: "settings-outline", label: "Ajustes" },
  ];

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <CustomIcon
              name={tab.name}
              size={20}
              color={isActive ? CoresInstitucionais.amarelo : CoresInstitucionais.brancoPuro}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
