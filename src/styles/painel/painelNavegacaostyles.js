import {StyleSheet} from "react-native";
import { CoresInstitucionais } from "../theme";

export const painelNavegacaostyles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  navContainer: {
    backgroundColor: CoresInstitucionais.azulPrincipal,
    borderTopColor: CoresInstitucionais.amarelo,
    borderTopWidth: 3,
  },
  sidebarDesktop: {
    width: 260,
    padding: 20,
    justifyContent: 'space-between',
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderRightColor: '#f2c500',
  },
  barMobile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerDesktop: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoBadge: {
    backgroundColor: '#f2c500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  logoTextoBadge: {
    color: '#032551',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tituloMenu: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtituloMenu: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 4,
  },
  perfilBadgeTexto: {
    color: '#f2c500',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  botoesWrapper: {
    gap: 8,
    flex: 1,
  },
  botoesWrapperMobile: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'transparent',
    gap: 10,
  },
  botaoNavAtivo: {
    backgroundColor: '#173ea5',
    borderLeftWidth: 4,
    borderLeftColor: '#f2c500',
  },
  iconeNav: {
    fontSize: 18,
  },
  textoBotaoNav: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  textoBotaoNavAtivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  iconeSair: {
    fontSize: 14,
  },
  textoBotaoSair: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 12,
  },
});