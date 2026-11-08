import { StyleSheet } from "react-native";

export const carrosselServicosStyles = StyleSheet.create({
  carrosselWrapper: {
    backgroundColor: '#0A2540',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  listaServicos: {
    flexDirection: 'row',
  },
  
  // 🌟 NOVO CARD MODERNO DO CARROSSEL
  cardCarrosselModerno: {
    width: 250,
    minHeight: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: '#1943A5',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  cardHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  badgeNumero: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardNumero: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1943A5',
  },
  cardBody: {
    flex: 1,
    marginVertical: 6,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A2540',
    marginBottom: 4,
  },
  cardDescricao: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    marginTop: 4,
  },
  tagContainer: {
    flex: 1,
    marginRight: 6,
  },
  tagTexto: {
    fontSize: 10,
    color: '#555',
    fontWeight: '600',
  },
  botaoDetalhesPequeno: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  botaoDetalhesText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1943A5',
  },

  // Mantidos para retrocompatibilidade caso algum outro lugar utilize
  card: {
    width: 220,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    justifyContent: 'space-between',
    borderTopWidth: 4,
    borderTopColor: '#FFD700',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  semResultados: {
    padding: 20,
    alignItems: 'center',
  },
  semResultadosTexto: {
    color: '#FFF',
    fontSize: 13,
  },
});