import { StyleSheet } from 'react-native';
import { CoresInstitucionais } from './theme';

export const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 81, 0.6)', // Fundo escurecido translúcido elegante
    justifyContent: 'center', // Centraliza o pop-up na tela
    alignItems: 'center',
    padding: 20,
  },
  toastContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: CoresInstitucionais.brancoPuro, // Fundo branco limpo para leitura confortável
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 5,
    borderLeftColor: CoresInstitucionais.amarelo, // Detalhe institucional Estácio
    borderTopWidth: 1,
    borderTopColor: CoresInstitucionais.bordaSuave,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CoresInstitucionais.azulPrincipal, // Título em azul escuro institucional
  },
  mensagem: {
    fontSize: 12,
    color: CoresInstitucionais.textoCinzaEscuro, // Texto legível e escuro
    lineHeight: 18,
    marginBottom: 12,
  },
  timerTexto: {
    fontSize: 10,
    color: CoresInstitucionais.textoCinza,
    fontStyle: 'italic',
    textAlign: 'right',
  },
});