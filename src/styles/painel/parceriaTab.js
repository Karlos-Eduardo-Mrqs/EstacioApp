import { StyleSheet } from "react-native";

export const parceriaTabstyles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  tituloPagina: { color: '#172554', fontSize: 23, fontWeight: '800', marginBottom: 5 },
  subtitulo: { color: '#64748B', fontSize: 13, lineHeight: 19, marginBottom: 16 },
  painel: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE3ED', borderRadius: 9, overflow: 'hidden' },
  linhaAmarela: { borderLeftWidth: 4, borderLeftColor: '#F2C500', padding: 13, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tituloSecao: { color: '#172554', fontSize: 15, fontWeight: '800' },
  textoAuxiliar: { color: '#64748B', fontSize: 11, marginTop: 4 },
  formulario: { padding: 16 },
  campo: { marginBottom: 13 },
  label: { color: '#172554', fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: { minHeight: 43, borderWidth: 1, borderColor: '#D6DFEA', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 10, color: '#172554', fontSize: 13, backgroundColor: '#FFFFFF' },
  inputMensagem: { minHeight: 80 },
  botaoSalvar: { backgroundColor: '#173EA5', borderLeftWidth: 4, borderLeftColor: '#F2C500', borderRadius: 8, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  textoBotaoSalvar: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  cardItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemTitulo: { color: '#172554', fontSize: 14, fontWeight: '700' },
  itemDesc: { color: '#64748B', fontSize: 12, marginTop: 2 },
  itemData: { color: '#D97706', fontSize: 11, fontWeight: '700', marginTop: 4 },
  botaoLixeira: { padding: 8 },
});