import { Text, TouchableOpacity, View } from "react-native";
import { sideNavBarStyles as styles } from "../styles/sideNavBarStyles";
import { CoresInstitucionais } from "../styles/theme";
import CustomIcon from "./CustomIcon";

export default function SidebarNavBar({ activeTab, onTabPress }) {
  const tabs = [
    { id: "mural", name: "calendar-outline", label: "Mural Acadêmico" },
    { id: "busca", name: "search-outline", label: "Pesquisar Eventos" },
    { id: "notificacoes", name: "notifications-outline", label: "Notificações" },
    { id: "parcerias", name: "partner-shops", label: "Parcerias" },
    { id: "configuracoes", name: "settings-outline", label: "Configurações" },

  ];

  return (
    <View style={styles.sidebar}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>Painel dos Alunos</Text>
        <Text style={styles.brandSubtitle}>Estácio Nova América</Text>
      </View>

      <View style={styles.menuList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <CustomIcon
                name={tab.name}
                size={20}
                color={isActive ? CoresInstitucionais.amarelo : CoresInstitucionais.brancoPuro}
              />
              <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
