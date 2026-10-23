import { View, Text} from "react-native";
import CustomIcon from "../CustomIcon";
import {buscaTabstyles as styles} from "../../styles/tabs/buscaTabStyles";

export default function BuscaTab() {
  return (
    <View style={styles.containerTab}>
      <CustomIcon name="search-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Pesquisa de Eventos</Text>
      <Text style={styles.textoTab}>O campo de filtro e listagem de eventos em tempo real ficará aqui.</Text>
    </View>
  );
}

