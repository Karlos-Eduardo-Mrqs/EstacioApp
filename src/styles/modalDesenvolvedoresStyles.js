import { StyleSheet } from 'react-native';
import { CoresInstitucionais } from '../styles/theme';

export const modalDesenvolvedoresStyles = StyleSheet.create({
  overlay: { 
    flex: 1, backgroundColor: 'rgba(3, 37, 81, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 
  },
  modalConteudo: { 
    width: '100%', maxHeight: '85%', backgroundColor: '#032551', 
    borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#ffbf1d', elevation: 10 
  },
  cabecalhoModal: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#032551', padding: 16, borderBottomWidth: 3, borderBottomColor: '#ffbf1d' 
  },
  tituloModal: { fontSize: 15, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro },
  btnFechar: { padding: 4 },
  textoFechar: { fontSize: 18, fontWeight: 'bold', color: CoresInstitucionais.brancoPuro },
  
  corpoModalScroll: { padding: 16, gap: 12 },
  
  cardDev: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: CoresInstitucionais.amarelo,
    elevation: 3,
    alignItems: 'center', // Garante centralização no cartão
  },
  headerCardDev: {
    flexDirection: 'column', // Foto em cima, nome e cargo centralizados abaixo
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CoresInstitucionais.azulPrincipal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    color: CoresInstitucionais.brancoPuro,
    fontWeight: 'bold',
    fontSize: 16,
  },
  devNome: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: CoresInstitucionais.azulPrincipal, 
    textAlign: 'center',
  },
  devPapel: { 
    fontSize: 11, 
    color: CoresInstitucionais.textoCinza, 
    fontStyle: 'italic',
    textAlign: 'center',
  },
  linksContainer: {
    flexDirection: 'row', // 👈 Coloca todos os contactos em uma linha só
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // Quebra de linha automática caso a tela seja muito pequena
    gap: 14, // Espaçamento horizontal entre os links
    borderTopWidth: 1,
    borderTopColor: CoresInstitucionais.bordaSuave,
    paddingTop: 10,
    width: '100%',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 11,
    color: CoresInstitucionais.azulPrincipal,
    fontWeight: 'bold',
  },
});