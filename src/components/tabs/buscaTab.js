import { View, Text, StyleSheet } from "react-native";
import CustomIcon from "../CustomIcon";

export default function BuscaTab() {
  return (
    <View style={styles.containerTab}>
      <CustomIcon name="search-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Pesquisa de Eventos</Text>
      <Text style={styles.textoTab}>O campo de filtro e listagem de eventos em tempo real ficará aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerTab: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 350,
  },
  tituloTab: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#032551",
    marginTop: 10,
    marginBottom: 8,
  },
  textoTab: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});