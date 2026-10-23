import { StyleSheet, Platform } from "react-native";
import { CoresInstitucionais } from "../styles/theme";

export const bottomNavBarstyles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(3, 37, 81, 0.95)",
    height: 65,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: CoresInstitucionais.amarelo,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    ...(Platform.OS === 'web' && {
      position: 'fixed', // 👈 Garante que fica estático no fundo da viewport
      bottom: 0,
      left: 0,
      width: '100vw',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
    }),
  },
  navItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5, 76, 169, 0.3)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  navItemActive: {
    backgroundColor: "rgba(5, 76, 169, 0.6)",
    borderColor: CoresInstitucionais.amarelo,
    borderWidth: 1.5,
  },
});