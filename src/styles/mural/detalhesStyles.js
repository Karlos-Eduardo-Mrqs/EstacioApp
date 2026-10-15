import { StyleSheet } from "react-native";
import { CoresInstitucionais } from "../theme";

export const detalheStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalConteudo: {
    width: "100%",
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 4,
    overflow: "hidden",
  },
  cabecalhoModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: CoresInstitucionais.bordaSuave,
  },
  tituloModal: {
    fontSize: 16,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
    flex: 1,
  },
  btnFechar: { paddingHorizontal: 10 },
  textoFechar: {
    fontSize: 16,
    fontWeight: "bold",
    color: CoresInstitucionais.preto,
  },
  corpoModal: { padding: 15 },
  textoDetalhe: {
    fontSize: 13,
    color: CoresInstitucionais.textoCinza,
    marginBottom: 6,
  },
  textoBold: { fontWeight: "bold", color: CoresInstitucionais.preto },
  caixaDescricao: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: CoresInstitucionais.bordaSuave,
    borderStyle: "dashed",
  },
  textoDescricao: {
    marginTop: 4,
    color: CoresInstitucionais.textoCinzaEscuro,
    fontSize: 13,
    lineHeight: 18,
  },
  rodapeBotoes: { flexDirection: "row", width: "100%", marginTop: 10, gap: 10 },
  btnAcao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    elevation: 2,
  },
  btnCompartilhar: { backgroundColor: CoresInstitucionais.azulSecundario },
  textoBtnCompartilhar: {
    fontWeight: "bold",
    color: CoresInstitucionais.brancoPuro,
  },
  btnNotificar: { backgroundColor: CoresInstitucionais.amarelo },
  textoBtnAcao: { fontWeight: "bold", color: CoresInstitucionais.preto },
  rodapeBotoesContainer: {
    flexDirection: "row", // Garante que os botões fiquem lado a lado
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  botaoRodapeCompacto: {
    backgroundColor: CoresInstitucionais.brancoPuro, // Fundo branco em destaque
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: CoresInstitucionais.amareloEstacio,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  textoBotaoRodape: {
    fontSize: 11,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal, // Texto escuro e bem visível sobre o fundo branco
  },
});
