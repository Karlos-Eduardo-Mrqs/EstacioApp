import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";

export default function NotificacoesTab({ notificacoes, onRemover, onSelectEvento }) {
  return (
    <ScrollView contentContainerStyle={styles.containerTab} showsVerticalScrollIndicator={false}>
      <CustomIcon name="notifications-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Notificações e Avisos</Text>

      {notificacoes && notificacoes.length > 0 ? (
        <View style={styles.listaContainer}>
          {notificacoes.map((evento) => (
            <View key={evento.id} style={styles.cartaoNotificacao}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.tagEvento}>{evento.tipo || "Evento"}</Text>
                <Text style={styles.tituloEvento} numberOfLines={2}>
                  {evento.titulo}
                </Text>
                <Text style={styles.dataEvento}>
                  📅 {evento.dia} de {evento.mes} | 🎓 {evento.turma}
                </Text>
              </View>

              <View style={styles.botoesAcao}>
                {onSelectEvento && (
                  <TouchableOpacity 
                    style={styles.btnDetalhes} 
                    onPress={() => onSelectEvento(evento)}
                  >
                    <Text style={styles.textoBtnDetalhes}>Ver</Text>
                  </TouchableOpacity>
                )}

                {/* Botão para retirar/remover a notificação */}
                <TouchableOpacity 
                  style={styles.btnRemover} 
                  onPress={() => onRemover(evento.id)}
                  activeOpacity={0.7}
                >
                  <CustomIcon name="trash-outline" size={16} color="#b00020" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.textoTab}>
          Nenhum evento salvo nas suas notificações ainda. Clique em "Notificar" nos detalhes de um evento para guardá-lo aqui.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerTab: {
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  tituloTab: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#032551",
    marginTop: 10,
    marginBottom: 15,
  },
  textoTab: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    maxWidth: 400,
  },
  listaContainer: {
    width: "100%",
    maxWidth: 600,
    gap: 12,
  },
  cartaoNotificacao: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#032551",
  },
  tagEvento: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#054ca9",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  tituloEvento: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  dataEvento: {
    fontSize: 11,
    color: "#666",
  },
  botoesAcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnDetalhes: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  textoBtnDetalhes: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#054ca9",
  },
  btnRemover: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fde8e8",
    justifyContent: "center",
    alignItems: "center",
  },
});