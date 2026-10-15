import { Text, TouchableOpacity, View } from "react-native";
import { appStyles as styles } from "../../styles/mural/mainStyles";

export default function Cabecalho({ onAdminPress }) {
  return (
    <View style={styles.cabecalho}>
      <View style={{ flex: 1 }}>
        <Text style={styles.tituloCabecalho}>Mural Nova América</Text>
        <Text style={styles.subtituloCabecalho}>
          Campus Nova América - Estácio
        </Text>
      </View>

      <TouchableOpacity style={styles.btnLoginCabecalho} onPress={onAdminPress}>
        <Text style={styles.textoBtnLogin}> Login</Text>
      </TouchableOpacity>
    </View>
  );
}
