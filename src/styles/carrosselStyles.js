import { StyleSheet, Dimensions } from 'react-native';

// Pega a largura da tela do dispositivo e calcula a largura do item do carrossel
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8; // Exemplo: 80% da largura da tela

export const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  tituloSecao: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#032551',
    borderBottomWidth: 2,
    borderBottomColor: '#054ca9',
    paddingBottom: 5,
    marginBottom: 12,
    marginHorizontal: 15,
  },
  track: {
    paddingHorizontal: 15,
    gap: 16,
  },
  itemCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#032551',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#ffbf1d', // Amarelo institucional Estácio
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffbf1d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 18,
  },
});