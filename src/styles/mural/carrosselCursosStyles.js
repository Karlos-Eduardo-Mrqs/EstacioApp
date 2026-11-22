import { StyleSheet } from "react-native";
import { CoresInstitucionais } from "../theme"; // Importa o nosso ficheiro centralizado

export const carrosselCursosStyles = StyleSheet.create({
  container: {
    marginVertical: 15,
    backgroundColor: CoresInstitucionais.azulPrincipal,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  headerBotoes: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    gap: 10,
    paddingHorizontal: 15,
  },
  botaoTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: CoresInstitucionais.azulSecundario,
    alignItems: "center",
    borderWidth: 1,
    borderColor: CoresInstitucionais.azulSecundario,
  },
  botaoTabAtivo: {
    backgroundColor: CoresInstitucionais.amareloEstacio,
    borderColor: CoresInstitucionais.amarelo,
  },
  textoTab: {
    fontSize: 12,
    fontWeight: "bold",
    color: CoresInstitucionais.brancoPuro,
  },
  textoTabAtivo: {
    color: CoresInstitucionais.amarelo,
  },
  scrollContainer: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 12,
  },
  depthCard: {
    width: 236,
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 10,
    padding: 15,
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
    borderTopWidth: 3,
    borderTopColor: CoresInstitucionais.amarelo,
  },
  badgeContainer: {
    backgroundColor: CoresInstitucionais.azulClaroFundo,
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: CoresInstitucionais.azulSecundario,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 11,
    color: CoresInstitucionais.textoCinza,
    lineHeight: 16,
    marginBottom: 10,
  },
  footerCard: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardModalidade: {
    fontSize: 10,
    color: CoresInstitucionais.textoCinza,
    flex: 1,
  },
  verMais: {
    fontSize: 11,
    fontWeight: "bold",
    color: CoresInstitucionais.azulSecundario,
  },
});
