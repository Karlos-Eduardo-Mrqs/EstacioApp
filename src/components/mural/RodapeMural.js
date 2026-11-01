import { Text, TouchableOpacity, View } from "react-native";
import { rodapeStyles as styles } from "../../styles/mural/rodapeStyles";
import CustomIcon from "../CustomIcon";

export default function RodapeInstitucional({ onOpenDevs, onOpenSobre }) {
  return (
    <View style={styles.rodape}>
      <Text style={styles.textoRodapeInstitucional}>
        Universidade Estácio de Sá · Campus Nova América | Mural Acadêmico
      </Text>

      <View style={styles.rodapeBotoesContainer}>
        <TouchableOpacity
          style={styles.botaoRodapeCompacto}
          onPress={onOpenDevs}
        >
          <Text style={styles.textoBotaoRodape}> <CustomIcon name="people-outline" size={12} color="#173EA5" />  Desenvolvedores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoRodapeCompacto} onPress={onOpenSobre}>
          <Text style={styles.textoBotaoRodape}> <CustomIcon name="information-circle-outline" size={12} color="#173EA5" /> Sobre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}