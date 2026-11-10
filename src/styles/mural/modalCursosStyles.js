import { StyleSheet } from "react-native";
import { CoresInstitucionais } from "../theme";

export const modalCursosStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(3, 37, 81, 0.6)",
    justifyContent: "flex-end",
  },
  modalConteudo: {
    width: "100%",
    height: "92%",
    backgroundColor: "#f4f6f9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  cabecalhoModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: CoresInstitucionais.azulPrincipal,
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: CoresInstitucionais.amarelo,
  },
  subtituloModalHeader: {
    fontSize: 10,
    color: CoresInstitucionais.amarelo,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  tituloModal: {
    fontSize: 16,
    fontWeight: "bold",
    color: CoresInstitucionais.brancoPuro,
    flex: 1,
    marginRight: 10,
  },
  btnFechar: { padding: 4 },
  textoFechar: {
    fontSize: 18,
    fontWeight: "bold",
    color: CoresInstitucionais.brancoPuro,
  },
  corpoModalScroll: { padding: 12, paddingBottom: 40 },

  blocoSecao: {
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: CoresInstitucionais.bordaSuave,
    elevation: 2,
  },
  tituloBlocoSecao: {
    fontSize: 12,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
    letterSpacing: 0.5,
  },
  linhaAmarela: {
    height: 3,
    backgroundColor: CoresInstitucionais.amarelo,
    width: 35,
    marginTop: 4,
    marginBottom: 10,
  },
  textoApresentacao: {
    fontSize: 12,
    color: CoresInstitucionais.textoCinzaEscuro,
    lineHeight: 18,
    marginBottom: 8,
  },
  textoModalidade: {
    fontSize: 11,
    color: CoresInstitucionais.textoCinza,
    marginBottom: 10,
  },
  btnSiteOficial: {
    backgroundColor: CoresInstitucionais.amarelo,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 4,
  },
  textoBtnSite: {
    fontWeight: "bold",
    color: CoresInstitucionais.brancoPuro,
    fontSize: 11,
  },

  eventoCardModal: {
    backgroundColor: CoresInstitucionais.fundoGeral,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: CoresInstitucionais.bordaSuaveAlternativa,
    borderLeftWidth: 3,
    borderLeftColor: CoresInstitucionais.azulSecundario,
  },
  tagEventoModal: {
    fontSize: 8,
    backgroundColor: CoresInstitucionais.azulClaroFundo,
    color: CoresInstitucionais.azulPrincipal,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tituloEventoModal: {
    fontSize: 12,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
    marginBottom: 4,
  },
  dataEventoModal: {
    fontSize: 10,
    color: CoresInstitucionais.textoCinza,
    marginBottom: 8,
  },
  btnDetalhesModal: {
    backgroundColor: CoresInstitucionais.azulSecundario,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  textoBtnDetalhesModal: {
    color: CoresInstitucionais.brancoPuro,
    fontSize: 10,
    fontWeight: "bold",
  },

  textoVazio: {
    fontSize: 11,
    color: CoresInstitucionais.textoCinza,
    fontStyle: "italic",
  },

  cardCoordenacao: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },
  topoCoordenacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarCoordenacao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CoresInstitucionais.azulSecundario,
    justifyContent: "center",
    alignItems: "center",
  },
  nomeCoordenacao: {
    fontSize: 12,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
  },
  descricaoCoordenacao: {
    fontSize: 11,
    color: CoresInstitucionais.textoCinza,
    lineHeight: 16,
  },
  btnContato: {
    backgroundColor: CoresInstitucionais.azulSecundario,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  textoBtnContato: {
    color: CoresInstitucionais.brancoPuro,
    fontSize: 11,
    fontWeight: "bold",
  },

  // ── ESTILOS DA SEÇÃO DE PUBLICAÇÕES ──
  listaPublicacoes: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 8,
  },

  publicacaoCard: {
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: CoresInstitucionais.bordaSuaveAlternativa,
  },

  imagemPublicacao: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e5e5",
  },

  imagemPublicacaoVazia: {
    width: "100%",
    height: 140,
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
  },

  conteudoPublicacao: {
    padding: 10,
    minHeight: 110,
    justifyContent: "space-between",
  },

  tituloPublicacao: {
    fontSize: 13,
    fontWeight: "700",
    color: CoresInstitucionais.azulPrincipal,
    marginBottom: 6,
  },

  descricaoPublicacao: {
    fontSize: 11,
    color: "#666666",
    lineHeight: 16,
  },

  btnExpandirPublicacao: {
    color: "#0754A6",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },

  // ── ESTILOS DO MODAL DE IMAGEM EM TELA CHEIA ──
  overlayImagem: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  btnFecharImagem: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 20,
  },

  imagemOriginal: {
    width: "100%",
    height: "85%",
  },
});