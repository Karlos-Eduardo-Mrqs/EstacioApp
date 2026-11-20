import { StyleSheet } from "react-native";

export const leituraPopupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 450,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#032551",
    flex: 1,
    marginRight: 10,
  },
  scrollArea: {
    maxHeight: 250,
    marginBottom: 16,
  },
  mensagem: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
  expiracao: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 16,
    fontStyle: "italic",
  },
  botaoConfirmar: {
    backgroundColor: "#032551",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoConfirmar: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});