import { StyleSheet } from 'react-native';
import { CoresInstitucionais} from '../styles/theme';

export const carrosselEventosStyles = StyleSheet.create({
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
