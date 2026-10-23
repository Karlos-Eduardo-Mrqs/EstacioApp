import { StyleSheet } from "react-native";

export const NotificaTabStyles = StyleSheet.create({
  containerTab: {
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  tituloTab: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#032551",
    marginTop: 10,
    marginBottom: 15,
  },
  textoTab: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    maxWidth: 400,
  },
  listaContainer: {
    width: "100%",
    maxWidth: 600,
    gap: 12,
  },
  cartaoNotificacao: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#032551",
  },
  tagEvento: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#054ca9",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  tituloEvento: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  dataEvento: {
    fontSize: 11,
    color: "#666",
  },
  botoesAcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnDetalhes: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  textoBtnDetalhes: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#054ca9",
  },
  btnRemover: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fde8e8",
    justifyContent: "center",
    alignItems: "center",
  },
});