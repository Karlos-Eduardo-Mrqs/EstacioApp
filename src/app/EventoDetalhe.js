import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import { detalheStyles as styles } from "../styles/mural/detalhesStyles";

export default function EventoDetalhe({ evento, onClose }) {
  const viewRef = useRef();

  const handleCompartilhar = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.9,
      });
      await Sharing.shareAsync(uri, {
        dialogTitle: "Compartilhar Evento",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o evento.");
    }
  };

  const handleNotificar = () => {
    Alert.alert("Salvo!", `Evento salvo localmente no seu celular.`);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View ref={viewRef} style={styles.modalConteudo}>
          <View style={styles.cabecalhoModal}>
            <Text style={styles.tituloModal}>{evento.titulo}</Text>
            <TouchableOpacity onPress={onClose} style={styles.btnFechar}>
              <Text style={styles.textoFechar}>X</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.corpoModal}>
            <Text style={styles.textoDetalhe}>
              📅 Data:{" "}
              <Text style={styles.textoBold}>
                {evento.dia} de {evento.mes}
              </Text>
            </Text>
            <Text style={styles.textoDetalhe}>
              🎓 Turma: <Text style={styles.textoBold}>{evento.turma}</Text>
            </Text>
            <Text style={styles.textoDetalhe}>
              🎤 Palestrante:{" "}
              <Text style={styles.textoBold}>{evento.autor}</Text>
            </Text>
            <Text style={styles.textoDetalhe}>
              🕛 Horas Acc:{" "}
              <Text style={styles.textoBold}>{evento.horas_acc}</Text>
            </Text>

            <View style={styles.caixaDescricao}>
              <Text style={styles.textoBold}>Sobre o evento:</Text>
              <Text style={styles.textoDescricao}>{evento.descricao}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rodapeBotoes}>
          <TouchableOpacity
            style={[styles.btnAcao, styles.btnCompartilhar]}
            onPress={handleCompartilhar}
          >
            <Text style={styles.textoBtnCompartilhar}>
              📲 Compartilhar Evento
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnAcao, styles.btnNotificar]}
            onPress={handleNotificar}
          >
            <Text style={styles.textoBtnAcao}>🔔 Notificar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
