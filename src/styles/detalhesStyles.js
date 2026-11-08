import { StyleSheet } from "react-native";
import { CoresInstitucionais } from "./theme";

export const detalheStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContentClean: {
    width: "92%",
    maxWidth: 540,
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  
  // 🖼️ Banner 16:9 Otimizado no Topo
  bannerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#032551',
    position: 'relative',
  },
  imagemPost: {
    width: '100%',
    height: '100%',
  },
  closeButtonClean: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },

  modalScrollClean: {
    paddingBottom: 24,
  },
  detailsInnerContainer: {
    padding: 24,
  },
  modalTituloClean: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 14,
    lineHeight: 27,
  },

  // 📅 Grid de Data e Local (Destaque)
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  infoBadgeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  infoBadgeTexto: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E40AF',
    flexShrink: 1,
  },

  // 🕒 Caixa Secundária (Palestrante e Horas AAC)
  detalhesSecundariosBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  linhaDetalhe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDetalhe: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  valorDetalhe: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
  },
  valorDestaqueAAC: {
    fontSize: 12.5,
    color: '#173EA5',
    fontWeight: '800',
  },

  modalSecaoLabelClean: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#032551",
    marginTop: 6,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDescricaoClean: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    marginBottom: 20,
  },

  // 🔘 Botões de Rodapé (Notificar / Compartilhar)
  actionButtonsRowClean: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  btnNotificarClean: {
    flex: 1.2,
    backgroundColor: "#032551",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 6,
  },
  btnNotificarTextoClean: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  btnCompartilharClean: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  btnCompartilharTextoClean: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export const buscaTabstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#262626',
    paddingVertical: 0,
  },
  clearButton: {
    fontSize: 14,
    color: '#8e8e8e',
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCard: {
    width: '32.6%',
    height: 220,
    backgroundColor: '#032551',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 81, 0.55)',
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 18,
  },
  vazioContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    width: '100%',
  },
  vazioTexto: {
    fontSize: 14,
    color: '#8e8e8e',
    textAlign: 'center',
  },
});