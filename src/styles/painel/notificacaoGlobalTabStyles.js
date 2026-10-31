import { StyleSheet } from "react-native";

export const notificacaoGlobalstyles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
});

export const notificacaoFormStyles = StyleSheet.create({
  painel: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE3ED', borderRadius: 9, overflow: 'hidden' },
  tituloPagina: { color: '#172554', fontSize: 24, fontWeight: '800', marginBottom: 5 },
  subtitulo: { color: '#64748B', fontSize: 12, lineHeight: 19, marginBottom: 16 },
  linhaAmarela: { borderLeftWidth: 4, borderLeftColor: '#F2C500', padding: 13, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tituloSecao: { color: '#172554', fontSize: 15, fontWeight: '800' },
  textoAuxiliar: { color: '#64748B', fontSize: 11, marginTop: 4 },
  formularioNotificacao: { padding: 16 },
  campo: { marginBottom: 13 },
  label: { color: '#172554', fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: { minHeight: 43, borderWidth: 1, borderColor: '#D6DFEA', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 10, color: '#172554', fontSize: 13, backgroundColor: '#FFFFFF' },
  inputMensagem: { minHeight: 120 },
  seletorCurso: { minHeight: 44, borderWidth: 1, borderColor: '#D6DFEA', borderRadius: 8, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#FFFFFF' },
  textoCurso: { color: '#172554', fontSize: 13 },
  contadorCaracteres: { textAlign: 'right', color: '#64748B', fontSize: 10, marginBottom: 12 },
  botaoEnviar: { backgroundColor: '#173EA5', borderLeftWidth: 4, borderLeftColor: '#F2C500', borderRadius: 8, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  textoBotaoEnviar: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.48)', justifyContent: 'center', padding: 16 },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 17, borderTopWidth: 4, borderTopColor: '#F2C500' },
  tituloModal: { color: '#172554', fontSize: 19, fontWeight: '800', marginBottom: 15 },
  opcaoCurso: { padding: 13, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  opcaoSelecionada: { backgroundColor: '#EEF2FF', borderColor: '#173EA5' },
  textoCursoSelecionado: { color: '#173EA5', fontWeight: '700' },
  botaoCancelar: { alignItems: 'center', padding: 12, marginTop: 6 },
  textoCancelar: { color: '#64748B', fontSize: 13, fontWeight: '700' },
});