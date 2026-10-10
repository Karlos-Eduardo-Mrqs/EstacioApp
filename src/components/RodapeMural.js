import { View, Text, TouchableOpacity } from 'react-native';
import { appStyles as styles } from '../styles/mainStyles';
import { detalheStyles } from '../styles/detalhesStyles';

export default function RodapeInstitucional({ onOpenDevs, onOpenSobre }) {
  return (
    <View style={styles.rodape}>
      <Text style={styles.textoRodapeInstitucional}>
        Universidade Estácio de Sá · Campus Nova América  |  Mural Acadêmico
      </Text>
      
      <View style={detalheStyles.rodapeBotoesContainer}>
        <TouchableOpacity style={detalheStyles.botaoRodapeCompacto} onPress={onOpenDevs}>
          <Text style={detalheStyles.textoBotaoRodape}>⚙️ Desenvolvedores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={detalheStyles.botaoRodapeCompacto} onPress={onOpenSobre}>
          <Text style={detalheStyles.textoBotaoRodape}>ℹ️ Sobre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}