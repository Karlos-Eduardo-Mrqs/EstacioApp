import { StyleSheet } from 'react-native';

export const Onboardingstyles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    position: 'relative',
  },
  btnPularHeader: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
  },
  textoPularHeader: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  stepContent: {
    paddingVertical: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#032551',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 8,
  },
  contadorText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 10,
    fontWeight: '600',
  },
  destaqueContador: {
    fontWeight: 'bold',
    color: '#032551',
  },
  listaScroll: {
    maxHeight: 210,
    marginVertical: 4,
  },
  cardCurso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardCursoSelecionado: {
    backgroundColor: '#032551',
    borderColor: '#032551',
  },
  cardCursoDesativado: {
    backgroundColor: '#e2e8f0',
    opacity: 0.6,
  },
  nomeCurso: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  nomeCursoSelecionado: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  nomeCursoDesativado: {
    color: '#94a3b8',
  },
  checkIcon: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  lockIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  resumoContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resumoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resumoBullet: {
    color: '#032551',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  resumoTexto: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#94a3b8',
    paddingVertical: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: '#032551',
  },
  descricaoFinal: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 18,
  },
});