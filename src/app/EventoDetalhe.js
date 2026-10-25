import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View, useWindowDimensions, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import CustomIcon from "../components/CustomIcon";
import FeedbackBox from "../components/FeedPopup"; 
import { buscaTabstyles as styles } from "../styles/tabs/buscaTabStyles";

export default function EventoDetalhe({ evento, onClose, onNotificar }) {
  const viewRef = useRef();
  const { width } = useWindowDimensions();
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const handleCompartilhar = async () => {
    setFeedback({ tipo: '', mensagem: '' });
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1.0,
      });

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `${evento.titulo ? evento.titulo.replace(/\s+/g, '_') : 'evento'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setFeedback({ tipo: 'sucesso', mensagem: 'A imagem do evento foi descarregada com sucesso!' });
      } else {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Compartilhar Evento",
        });
      }
    } catch (error) {
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível processar ou partilhar o evento.' });
    }
  };

  const handleNotificar = () => {
    if (onNotificar) {
      onNotificar(evento);
    }
    setFeedback({ tipo: 'sucesso', mensagem: 'Evento guardado nas notificações!' });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View ref={viewRef} style={styles.modalContentClean} collapsable={false}>
          
          <TouchableOpacity style={styles.closeButtonClean} onPress={onClose}>
            <CustomIcon name="close" size={18} color="#262626" />
          </TouchableOpacity>

          <View style={styles.modalScrollClean}>
            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

            <Text style={styles.modalTituloClean}>{evento.titulo}</Text>
            
            <Text style={styles.modalSubInfoClean}>
              📅 {evento.dia} de {evento.mes} • 📍 {evento.local || evento.turma || "Campus"}
            </Text>

            {evento.autor && (
              <Text style={styles.modalSubInfoClean}>
                🎤 Palestrante: {evento.autor}
              </Text>
            )}

            {evento.horas_acc && (
              <Text style={styles.modalSubInfoClean}>
                🕛 Horas Acc: {evento.horas_acc}
              </Text>
            )}

            <Text style={styles.modalSecaoLabelClean}>Sobre o evento:</Text>
            <Text style={styles.modalDescricaoClean}>
              {evento.descricao || "Nenhuma descrição detalhada informada para este evento."}
            </Text>

            <View style={styles.actionButtonsRowClean}>
              <TouchableOpacity 
                style={styles.btnNotificarClean}
                onPress={handleNotificar}
              >
                <CustomIcon name="notifications-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.btnNotificarTextoClean}>Notificar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnCompartilharClean}
                onPress={handleCompartilhar}
              >
                <Text style={styles.btnCompartilharTextoClean}>Compartilhar ↗</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    </Modal>
  );
}