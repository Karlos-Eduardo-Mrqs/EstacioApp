import { StyleSheet } from 'react-native';

export const painelStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },

  container: {
    padding: 16,
    paddingBottom: 35,
  },

  tituloPagina: {
    fontSize: 24,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 5,
  },

  subtituloPagina: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 18,
  },

  // PESQUISA

  barraPesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  pesquisaContainer: {
    flex: 1,
    minWidth: 0,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 9,
    paddingHorizontal: 12,
  },

  iconePesquisa: {
    fontSize: 25,
    color: '#64748b',
    marginRight: 8,
  },

  inputPesquisa: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    color: '#1e293b',
    fontSize: 13,
    outlineStyle: 'none',
  },

  limparPesquisa: {
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  iconeLimpar: {
    color: '#64748b',
    fontSize: 23,
  },

  botaoAdicionar: {
    width: 46,
    height: 46,
    borderRadius: 9,
    backgroundColor: '#173ea5',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#f2c500',
  },

  iconeAdicionar: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '400',
    marginTop: -2,
  },

  // LISTA

  cabecalhoLista: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tituloLista: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },

  contador: {
    fontSize: 12,
    color: '#64748b',
  },

  // CARTÃO COMPACTO

  usuarioCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },

  usuarioInfo: {
    flex: 2,
    minWidth: 155,
    gap: 4,
  },

  usuarioNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  usuarioEmail: {
    fontSize: 12,
    color: '#64748b',
  },

  detalhesUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },

  perfilBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  perfilTexto: {
    color: '#4338ca',
    fontSize: 10,
    fontWeight: '600',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusAtivo: {
    backgroundColor: '#dcfce7',
  },

  statusInativo: {
    backgroundColor: '#fee2e2',
  },

  statusBolinha: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  bolinhaAtiva: {
    backgroundColor: '#16a34a',
  },

  bolinhaInativa: {
    backgroundColor: '#ef4444',
  },

  statusTexto: {
    fontSize: 10,
    fontWeight: '700',
  },

  textoAtivo: {
    color: '#15803d',
  },

  textoInativo: {
    color: '#dc2626',
  },

  // AÇÕES

  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginLeft: 'auto',
  },

  botaoCadeado: {
    width: 34,
    height: 34,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  cadeadoAberto: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },

  cadeadoFechado: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },

  iconeCadeado: {
    fontSize: 16,
  },

  botaoRemover: {
    width: 34,
    height: 34,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeLixeira: {
    fontSize: 14,
  },

  // LISTA VAZIA

  listaVazia: {
    backgroundColor: '#ffffff',
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e2e8f0',
  },

  listaVaziaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    textAlign: 'center',
  },

  listaVaziaTexto: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },

  // MODAL DE CADASTRO

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f2c500',
  },

  modalCabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  modalTitulo: {
    fontSize: 19,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 4,
  },

  modalSubtitulo: {
    fontSize: 12,
    color: '#64748b',
  },

  botaoFechar: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeFechar: {
    fontSize: 24,
    color: '#475569',
    marginTop: -2,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 43,
    borderWidth: 1,
    borderColor: '#d7dce2',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: 13,
  },

  // SELEÇÃO DE PERFIL

  opcoesPerfil: {
    gap: 8,
  },

  opcaoPerfil: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    justifyContent: 'center',
  },

  opcaoSelecionada: {
    borderColor: '#3155b5',
    backgroundColor: '#f1f5ff',
  },

  opcaoPerfilTexto: {
    fontSize: 12,
    color: '#475569',
  },

  opcaoPerfilTextoSelecionado: {
    color: '#173ea5',
    fontWeight: '700',
  },

  // BOTÕES DO MODAL

  botaoCriar: {
    height: 44,
    backgroundColor: '#173ea5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    borderLeftWidth: 3,
    borderLeftColor: '#f2c500',
  },

  textoCriar: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  botaoCancelar: {
    height: 40,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoCancelar: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
});