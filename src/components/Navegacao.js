import { Text, TouchableOpacity, View } from "react-native";
import { bottomNavBarstyles } from "../styles/bottomNavBarStyles";
import { sideNavBarStyles } from "../styles/sideNavBarStyles";
import { CoresInstitucionais } from "../styles/theme";
import CustomIcon from "./CustomIcon";

// 🌐 Lista centralizada de abas para evitar duplicação
const tabs = [
  { id: "mural", name: "calendar-outline", label: "Mural", labelSidebar: "Mural Acadêmico" },
  { id: "busca", name: "search-outline", label: "Busca", labelSidebar: "Pesquisar Eventos" },
  { id: "notificacoes", name: "notifications-outline", label: "Avisos", labelSidebar: "Notificações" },
  { id: "parcerias", name: "partner-shops", label: "Parcerias", labelSidebar: "Parcerias" },
  { id: "configuracoes", name: "settings-outline", label: "Ajustes", labelSidebar: "Configurações" },
];

// 📱 Barra Inferior (Mobile)
export function BottomNavBar({ activeTab, onTabPress }) {
  return (
    <View style={bottomNavBarstyles.navContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[bottomNavBarstyles.navItem, isActive && bottomNavBarstyles.navItemActive]}
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

// 💻 Barra Lateral (Desktop / Telas Maiores)
export function SidebarNavBar({ activeTab, onTabPress }) {
  return (
    <View style={sideNavBarStyles.sidebar}>
      <View style={sideNavBarStyles.brandContainer}>
        <Text style={sideNavBarStyles.brandTitle}>Painel dos Alunos</Text>
        <Text style={sideNavBarStyles.brandSubtitle}>Estácio Nova América</Text>
      </View>

      <View style={sideNavBarStyles.menuList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[sideNavBarStyles.menuItem, isActive && sideNavBarStyles.menuItemActive]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <CustomIcon
                name={tab.name}
                size={20}
                color={isActive ? CoresInstitucionais.amarelo : CoresInstitucionais.brancoPuro}
              />
              <Text style={[sideNavBarStyles.menuText, isActive && sideNavBarStyles.menuTextActive]}>
                {tab.labelSidebar}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}