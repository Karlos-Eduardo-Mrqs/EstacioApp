import { StyleSheet, Platform } from 'react-native';

export const localStyles = StyleSheet.create({
  overlayEmbacado: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 25, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(16px)',
    }),
  },
  containerStepper: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  bannerLembrete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderColor: '#38bdf8',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  tituloLembrete: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  subtituloLembrete: {
    fontSize: 12,
    color: '#0c4a6e',
    marginTop: 2,
  },
  btnLembrete: {
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnLembreteTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  barraFiltrosAtivos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  textoFiltrosAtivos: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  linkRedefinir: {
    fontSize: 12,
    color: '#032551',
    fontWeight: 'bold',
  },
});