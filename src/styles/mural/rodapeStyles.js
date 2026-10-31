import { StyleSheet } from "react-native";
import { CoresInstitucionais } from "../theme";

export const rodapeStyles = StyleSheet.create({
  rodape: {
    backgroundColor: CoresInstitucionais.azulPrincipal,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 3,
    borderTopColor: CoresInstitucionais.amarelo,
    marginTop: 'auto',
    flexDirection: "column", // 👈 Coloca os elementos em pilha vertical
    alignItems: "center",    // 👈 Centraliza tudo horizontalmente
    gap: 14,                 // 👈 Espaçamento perfeito entre o texto e os botões
  },
  textoRodapeInstitucional: {
    fontSize: 11,
    color: "#cfd8dc",
    letterSpacing: 0.3,
    textAlign: "center",     // 👈 Garante o texto centralizado
  },
  rodapeBotoesContainer: {
    flexDirection: "row",    // 👈 Mantém os dois botões um ao lado do outro
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  botaoRodapeCompacto: {
    backgroundColor: CoresInstitucionais.brancoPuro,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: CoresInstitucionais.amarelo,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  textoBotaoRodape: {
    fontSize: 11,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
  },
});