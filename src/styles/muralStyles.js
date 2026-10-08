import { StyleSheet } from 'react-native';
import { CoresInstitucionais} from './theme';

export const appStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CoresInstitucionais.fundoGeral },
  
  cabecalho: {backgroundColor: CoresInstitucionais.azulPrincipal,padding: 16,
    flexDirection: 'row',justifyContent: 'space-between',
    alignItems: 'center',borderBottomWidth: 3, borderBottomColor: CoresInstitucionais.amareloEstacio,
  },
  tituloCabecalho: { 
    fontSize: 16, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro, flex: 1, marginRight: 10 
  },
  subtituloCabecalho: { 
    fontSize: 10, color: CoresInstitucionais.amareloEstacio, textTransform: 'uppercase', fontWeight: 'bold',marginTop: 2
  },
  btnLoginCabecalho: {
    backgroundColor: CoresInstitucionais.amareloEstacio,paddingVertical: 8,paddingHorizontal: 12,
    borderRadius: 6,alignItems: 'center',justifyContent: 'center',
    borderWidth: 1,borderColor: CoresInstitucionais.amareloEstacio,marginLeft: 10,
  },
  textoBtnLogin: {
    color: CoresInstitucionais.azulPrincipal,fontWeight: 'bold',fontSize: 11,
  },

  blocoSection: { backgroundColor: CoresInstitucionais.brancoPuro, margin: 10, padding: 15, borderRadius: 8, elevation: 1 },
  tituloSecaoBloco: { fontSize: 11, fontWeight: 'bold', color: CoresInstitucionais.azulPrincipal, borderBottomWidth: 2, borderBottomColor: CoresInstitucionais.azulEscuro, paddingBottom: 5, marginBottom: 10 },
  caixaAviso: { minHeight: 40 },
  textoMutavel: { color: CoresInstitucionais.textoCinza, fontSize: 12, fontStyle: 'italic' },

  scrollCalendario: { gap: 10, paddingBottom: 5 },
  calendarioBoxMini: { width: 220, borderWidth: 1, borderColor: CoresInstitucionais.bordaSuave, borderRadius: 6, overflow: 'hidden' },
  mesHeaderAzul: { backgroundColor: CoresInstitucionais.azulEscuro, padding: 6, alignItems: 'center' },
  mesTituloBranco: { color: CoresInstitucionais.brancoPuro, fontWeight: 'bold', fontSize: 12 },
  calendarioGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 5 },
  celulaDia: { width: '14.2%', alignItems: 'center', paddingVertical: 4 },
  textoDiaSemana: { color: CoresInstitucionais.textoCinza, fontSize: 9 },
  textoDia: { fontSize: 11, color: CoresInstitucionais.textoCinzaEscuro },
  diaDestaque: { backgroundColor: CoresInstitucionais.amareloEstacio, borderRadius: 12 },
  textoDiaDestaque: { fontWeight: 'bold', color: CoresInstitucionais.preto },
  diaSelecionado: { borderWidth: 2, borderColor: CoresInstitucionais.azulEscuro, borderRadius: 12 },
  textoDiaSelecionado: { color: CoresInstitucionais.azulEscuro, fontWeight: 'bold' },
  legendaCalendario: { fontSize: 9, color: CoresInstitucionais.textoCinza, textAlign: 'center', marginTop: 8 },

  areaEventosDoDia: { 
    marginTop: 15, marginHorizontal: 15, padding: 15, backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 8,borderWidth: 1,borderColor: CoresInstitucionais.bordaSuave,elevation: 2
  },
  
  tituloDiaFocado: { fontSize: 14, fontWeight: 'bold', color: CoresInstitucionais.azulEscuro, marginBottom: 12, textAlign: 'center'},
  cartaoDiaFocado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: CoresInstitucionais.fundoGeral, padding: 14, borderRadius: 6, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: CoresInstitucionais.azulEscuro},
  btnTextoMiniAzul: { color: CoresInstitucionais.azulEscuro, fontSize: 11, fontWeight: 'bold' },

  duasColunasContainer: { flexDirection: 'row', marginHorizontal: 10, marginBottom: 20, gap: 10 },
  coluna: { flex: 1, backgroundColor: CoresInstitucionais.brancoPuro, padding: 10, borderRadius: 8, elevation: 1 },
  
  cartaoPequeno: { backgroundColor: CoresInstitucionais.fundoGeral, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: CoresInstitucionais.bordaSuave, marginBottom: 10 },
  tagCartaoPequeno: { fontSize: 8, backgroundColor: CoresInstitucionais.azulClaroFundo, color: CoresInstitucionais.azulEscuro, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontWeight: 'bold', marginBottom: 6 },
  tituloCartaoPequeno: { fontSize: 12, fontWeight: 'bold', color: CoresInstitucionais.azulEscuro, marginBottom: 4 },
  dataCartaoPequeno: { fontSize: 10, color: CoresInstitucionais.textoCinza, marginBottom: 8 },
  btnVerDescricaoMini: { backgroundColor: CoresInstitucionais.azulEscuro, paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  btnTextoMini: { color: CoresInstitucionais.brancoPuro, fontSize: 10, fontWeight: 'bold' },

  // --- RODAPÉ NO APPSTYLES ---
  rodape: {
    backgroundColor: CoresInstitucionais.azulPrincipal,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 3,
    borderTopColor: CoresInstitucionais.amareloEstacio,
    marginTop: 15,           
    flexDirection: 'column',
  },
  textoRodapeInstitucional: {
    fontSize: 9,
    color: '#cfd8dc',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  cardDesenvolvedores: {
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 6,
    padding: 10,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: CoresInstitucionais.amareloEstacio,
    elevation: 2,
  },
  devHeaderRow: {
    flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',marginBottom: 2,
  },
  devTituloCard: {
    fontSize: 11,fontWeight: 'bold',color: CoresInstitucionais.azulPrincipal,
  },
  devSubToque: {
    fontSize: 9,color: CoresInstitucionais.azulSecundario,fontStyle: 'italic',
  },
  devNomesResumo: {
    fontSize: 9,color: CoresInstitucionais.textoCinza,
  },
});

export const detalheStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalConteudo: { width: '100%', backgroundColor: CoresInstitucionais.brancoPuro, borderRadius: 4, overflow: 'hidden' },
  cabecalhoModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f4f4f4', padding: 15, borderBottomWidth: 1, borderBottomColor: CoresInstitucionais.bordaSuave },
  tituloModal: { fontSize: 16, fontWeight: 'bold', color: CoresInstitucionais.azulPrincipal, flex: 1 },
  btnFechar: { paddingHorizontal: 10 },
  textoFechar: { fontSize: 16, fontWeight: 'bold', color: CoresInstitucionais.preto },
  corpoModal: { padding: 15 },
  textoDetalhe: { fontSize: 13, color: CoresInstitucionais.textoCinza, marginBottom: 6 },
  textoBold: { fontWeight: 'bold', color: CoresInstitucionais.preto },
  caixaDescricao: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: CoresInstitucionais.bordaSuave, borderStyle: 'dashed' },
  textoDescricao: { marginTop: 4, color: CoresInstitucionais.textoCinzaEscuro, fontSize: 13, lineHeight: 18 },
  rodapeBotoes: { flexDirection: 'row', width: '100%', marginTop: 10, gap: 10 },
  btnAcao: { flex: 1, paddingVertical: 12, borderRadius: 4, alignItems: 'center', elevation: 2 },
  btnCompartilhar: { backgroundColor: CoresInstitucionais.azulSecundario },
  textoBtnCompartilhar: { fontWeight: 'bold', color: CoresInstitucionais.brancoPuro },
  btnNotificar: { backgroundColor: CoresInstitucionais.amarelo },
  textoBtnAcao: { fontWeight: 'bold', color: CoresInstitucionais.preto }
});

export const estilosCarrosselEvento = StyleSheet.create({
  containerScroll: { paddingHorizontal: 15, gap: 12 },
  cartao: {
    width: 230, backgroundColor: CoresInstitucionais.brancoPuro, borderRadius: 10, padding: 14, justifyContent: 'space-between',
    borderWidth: 1, borderColor: CoresInstitucionais.bordaSuave, borderTopWidth: 4, borderTopColor: CoresInstitucionais.azulSecundario,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3,
  },
  tag: {
    alignSelf: 'flex-start', backgroundColor: CoresInstitucionais.azulClaroFundo, color: CoresInstitucionais.azulSecundario, fontSize: 9,
    fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 6,
  },
  titulo: { fontSize: 13, fontWeight: 'bold', color: CoresInstitucionais.azulPrincipal, marginBottom: 6, height: 34 },
  data: { fontSize: 11, color: CoresInstitucionais.textoCinza, marginBottom: 2 },
  local: { fontSize: 11, color: CoresInstitucionais.textoCinza, marginBottom: 10 },
  botaoDetalhes: { backgroundColor: CoresInstitucionais.azulSecundario, paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  textoBotao: { color: CoresInstitucionais.brancoPuro, fontSize: 11, fontWeight: 'bold' },
});

export const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(3, 37, 81, 0.6)', 
    justifyContent: 'flex-end', 
  },
  modalConteudo: { 
    width: '100%', 
    height: '92%', 
    backgroundColor: '#f4f6f9', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    overflow: 'hidden',
  },
  cabecalhoModal: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: CoresInstitucionais.azulPrincipal, 
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: CoresInstitucionais.amarelo
  },
  subtituloModalHeader: { fontSize: 10, color: CoresInstitucionais.amarelo, textTransform: 'uppercase', fontWeight: 'bold' },
  tituloModal: { fontSize: 16, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro, flex: 1, marginRight: 10 },
  btnFechar: { padding: 4 },
  textoFechar: { fontSize: 18, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro },
  
  corpoModalScroll: { 
    padding: 12, 
    paddingBottom: 40 
  },
  
  blocoSecao: {
    backgroundColor: CoresInstitucionais.brancoPuro,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: CoresInstitucionais.bordaSuave,
    elevation: 2,
  },
  tituloBlocoSecao: {
    fontSize: 12,
    fontWeight: 'bold',
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
    alignItems: 'center',
    marginTop: 4,
  },
  textoBtnSite: {
    fontWeight: 'bold',
    color: CoresInstitucionais.azulPrincipal,
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
    alignItems: 'center',
  },
  textoBtnDetalhesModal: {
    color: CoresInstitucionais.brancoPuro,
    fontSize: 10,
    fontWeight: 'bold',
  },

  textoVazio: {
    fontSize: 11,
    color: CoresInstitucionais.textoCinza,
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
    backgroundColor: CoresInstitucionais.azulSecundario,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomeCoordenacao: {
    fontSize: 12,
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  textoBtnContato: {
    color: CoresInstitucionais.brancoPuro,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export const modalDesenvolvedoresStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(3, 37, 81, 0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalConteudo: { 
    width: '100%', 
    backgroundColor: '#ffffff', 
    borderRadius: 10, 
    overflow: 'hidden', 
    elevation: 5 
  },
  cabecalhoModal: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: CoresInstitucionais.azulPrincipal, 
    padding: 16, 
    borderBottomWidth: 3, 
    borderBottomColor: CoresInstitucionais.amareloEstacio 
  },
  tituloModal: { fontSize: 14, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro },
  btnFechar: { padding: 4 },
  textoFechar: { fontSize: 16, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro },
  corpoModal: { padding: 16, gap: 10 },
  subtitulo: { fontSize: 11, fontWeight: 'bold', color: CoresInstitucionais.azulPrincipal, textTransform: 'uppercase', marginBottom: 2 },
  devItem: { 
    backgroundColor: CoresInstitucionais.fundoGeral, 
    padding: 10, 
    borderRadius: 6, 
    borderLeftWidth: 3, 
    borderLeftColor: CoresInstitucionais.azulSecundario, 
  },
  devNome: { fontSize: 12, fontWeight: 'bold', color: CoresInstitucionais.azulPrincipal },
  devPapel: { fontSize: 10, color: CoresInstitucionais.textoCinza },
  btnAcao: { 
    backgroundColor: CoresInstitucionais.amareloEstacio, 
    paddingVertical: 10, 
    borderRadius: 6, 
    alignItems: 'center', 
    marginTop: 6 
  },
  textoBtnAcao: { color: CoresInstitucionais.azulPrincipal, fontWeight: 'bold', fontSize: 11 },
});