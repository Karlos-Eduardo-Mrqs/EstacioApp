import { StyleSheet } from "react-native";
import { CoresInstitucionais } from "../styles/theme";

export const sideNavBarStyles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: CoresInstitucionais.azulPrincipal,
    height: "100vh",
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRightWidth: 2,
    borderRightColor: CoresInstitucionais.amarelo,
    position: "sticky",
    top: 0,
    left: 0,
  },
  brandContainer: {
    marginBottom: 35,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 215, 0, 0.2)",
    paddingBottom: 15,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: CoresInstitucionais.amarelo,
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    marginTop: 2,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  menuText: {
    fontSize: 14,
    color: CoresInstitucionais.brancoPuro,
    fontWeight: "500",
  },
  menuTextActive: {
    color: CoresInstitucionais.amarelo,
    fontWeight: "bold",
  },
});