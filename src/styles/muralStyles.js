import { StyleSheet } from 'react-native';

export const appStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  cabecalho: { backgroundColor: '#054ca9', padding: 20, paddingTop: 40 },
  tituloCabecalho: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  subtituloCabecalho: { color: '#b1ded3', fontSize: 12, marginTop: 2 },
  
  blocoSection: { backgroundColor: '#ffffff', margin: 10, padding: 15, borderRadius: 8, elevation: 1 },
  tituloSecaoBloco: { fontSize: 11, fontWeight: 'bold', color: '#032551', borderBottomWidth: 2, borderBottomColor: '#054ca9', paddingBottom: 5, marginBottom: 10 },
  caixaAviso: { minHeight: 40 },
  textoMutavel: { color: '#666', fontSize: 12, fontStyle: 'italic' },

  scrollCalendario: { gap: 10, paddingBottom: 5 },
  calendarioBoxMini: { width: 220, borderWidth: 1, borderColor: '#eee', borderRadius: 6, overflow: 'hidden' },
  mesHeaderAzul: { backgroundColor: '#054ca9', padding: 6, alignItems: 'center' },
  mesTituloBranco: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  calendarioGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 5 },
  celulaDia: { width: '14.2%', alignItems: 'center', paddingVertical: 4 },
  textoDiaSemana: { color: '#666', fontSize: 9 },
  textoDia: { fontSize: 11, color: '#333' },
  diaDestaque: { backgroundColor: '#ffbf1d', borderRadius: 12 },
  textoDiaDestaque: { fontWeight: 'bold', color: '#000' },
  diaSelecionado: { borderWidth: 2, borderColor: '#032551', borderRadius: 12 },
  textoDiaSelecionado: { color: '#032551', fontWeight: 'bold' },
  legendaCalendario: { fontSize: 9, color: '#888', textAlign: 'center', marginTop: 8 },

  areaEventosDoDia: { 
    marginTop: 15, 
    marginHorizontal: 15, 
    padding: 15, 
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2
  },
  
  tituloDiaFocado: { fontSize: 14, fontWeight: 'bold', color: '#054ca9', marginBottom: 12, textAlign: 'center'},
  cartaoDiaFocado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 14, borderRadius: 6, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#054ca9'},
  btnTextoMiniAzul: { color: '#054ca9', fontSize: 11, fontWeight: 'bold' },

  duasColunasContainer: { flexDirection: 'row', marginHorizontal: 10, marginBottom: 20, gap: 10 },
  coluna: { flex: 1, backgroundColor: '#ffffff', padding: 10, borderRadius: 8, elevation: 1 },
  
  cartaoPequeno: { backgroundColor: '#f8f9fa', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  tagCartaoPequeno: { fontSize: 8, backgroundColor: '#e3f2fd', color: '#032551', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontWeight: 'bold', marginBottom: 6 },
  tituloCartaoPequeno: { fontSize: 12, fontWeight: 'bold', color: '#032551', marginBottom: 4 },
  dataCartaoPequeno: { fontSize: 10, color: '#666', marginBottom: 8 },
  btnVerDescricaoMini: { backgroundColor: '#054ca9', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  btnTextoMini: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' }
});

export const detalheStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalConteudo: { width: '100%', backgroundColor: '#ffffff', borderRadius: 4, overflow: 'hidden' },
  cabecalhoModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f4f4f4', padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tituloModal: { fontSize: 16, fontWeight: 'bold', color: '#032551', flex: 1 },
  btnFechar: { paddingHorizontal: 10 },
  textoFechar: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  corpoModal: { padding: 15 },
  textoDetalhe: { fontSize: 13, color: '#555', marginBottom: 6 },
  textoBold: { fontWeight: 'bold', color: '#000' },
  caixaDescricao: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#e0e0e0', borderStyle: 'dashed' },
  textoDescricao: { marginTop: 4, color: '#444', fontSize: 13, lineHeight: 18 },
  rodapeBotoes: { flexDirection: 'row', width: '100%', marginTop: 10, gap: 10 },
  btnAcao: { flex: 1, paddingVertical: 12, borderRadius: 4, alignItems: 'center', elevation: 2 },
  btnCompartilhar: { backgroundColor: '#054ca9' },
  textoBtnCompartilhar: { fontWeight: 'bold', color: '#ffffff' },
  btnNotificar: { backgroundColor: '#ffbf1d' },
  textoBtnAcao: { fontWeight: 'bold', color: '#000' }
});

export const estilosCarrosselEvento = StyleSheet.create({
  containerScroll: { paddingHorizontal: 15, gap: 12 },
  cartao: {
    width: 230, backgroundColor: '#ffffff', borderRadius: 10, padding: 14, justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#e0e0e0', borderTopWidth: 4, borderTopColor: '#054ca9',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3,
  },
  tag: {
    alignSelf: 'flex-start', backgroundColor: '#e3f2fd', color: '#054ca9', fontSize: 9,
    fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 6,
  },
  titulo: { fontSize: 13, fontWeight: 'bold', color: '#032551', marginBottom: 6, height: 34 },
  data: { fontSize: 11, color: '#555', marginBottom: 2 },
  local: { fontSize: 11, color: '#777', marginBottom: 10 },
  botaoDetalhes: { backgroundColor: '#054ca9', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  textoBotao: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
});

export const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(3, 37, 81, 0.6)', 
    justifyContent: 'flex-end', 
  },
  modalConteudo: { 
    width: '100%', 
    height: '92%', // Ocupa mais espaço da tela, cobrindo o fundo adequadamente
    backgroundColor: '#f4f6f9', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    overflow: 'hidden',
  },
  cabecalhoModal: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#032551', 
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#ffbf1d'
  },
  subtituloModalHeader: { fontSize: 10, color: '#ffbf1d', textTransform: 'uppercase', fontWeight: 'bold' },
  tituloModal: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', flex: 1, marginRight: 10 },
  btnFechar: { padding: 4 },
  textoFechar: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  
  // Adicionado paddingBottom generico para afastar do touchpad inferior do celular
  corpoModalScroll: { 
    padding: 12, 
    paddingBottom: 40 
  },
  
  blocoSecao: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  tituloBlocoSecao: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#032551',
    letterSpacing: 0.5,
  },
  linhaAmarela: {
    height: 3,
    backgroundColor: '#ffbf1d',
    width: 35,
    marginTop: 4,
    marginBottom: 10,
  },
  textoApresentacao: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 18,
    marginBottom: 8,
  },
  textoModalidade: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 10,
  },
  btnSiteOficial: {
    backgroundColor: '#ffbf1d',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBtnSite: {
    fontWeight: 'bold',
    color: '#032551',
    fontSize: 11,
  },
  
  eventoCardModal: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 3,
    borderLeftColor: '#054ca9',
  },
  tagEventoModal: {
    fontSize: 8,
    backgroundColor: '#e3f2fd',
    color: '#032551',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tituloEventoModal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#032551',
    marginBottom: 4,
  },
  dataEventoModal: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 8,
  },
  btnDetalhesModal: {
    backgroundColor: '#054ca9',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  textoBtnDetalhesModal: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  textoVazio: {
    fontSize: 11,
    color: '#777777',
    fontStyle: 'italic',
  },

  cardCoordenacao: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
  topoCoordenacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCoordenacao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#054ca9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomeCoordenacao: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#032551',
  },
  descricaoCoordenacao: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
  },
  btnContato: {
    backgroundColor: '#054ca9',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  textoBtnContato: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  }
});