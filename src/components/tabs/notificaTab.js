import { View, Text, StyleSheet } from "react-native";
import CustomIcon from "../CustomIcon";

export default function NotificacoesTab() {
  return (
    <View style={styles.containerTab}>
      <CustomIcon name="notifications-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Notificações e Avisos</Text>
      <Text style={styles.textoTab}>Aqui serão exibidos os alertas importantes do campus.</Text>
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