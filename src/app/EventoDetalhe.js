import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View, useWindowDimensions, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import { detalheStyles as styles } from "../styles/mural/detalhesStyles";
import CustomIcon from "../components/CustomIcon";
import { CoresInstitucionais } from "../styles/theme";
import FeedbackBox from "../components/FeedPopup"; 

export default function EventoDetalhe({ evento, onClose, onNotificar }) {
  const viewRef = useRef();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
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
      <View style={styles.overlay}>
        <View ref={viewRef} style={styles.modalConteudo}>
          <View style={styles.cabecalhoModal}>
            <Text style={styles.tituloModal}>{evento.titulo}</Text>
            <TouchableOpacity onPress={onClose} style={styles.btnFechar}>
              <CustomIcon 
                  name={isDesktop ? "close" : "arrow-back"} 
                  size={22} 
                  color={CoresInstitucionais.azulPrincipal} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.corpoModal}>
            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

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
          <TouchableOpacity style={[styles.btnAcao, styles.btnCompartilhar]} onPress={handleCompartilhar}>
            <Text style={styles.textoBtnCompartilhar}>📲 Compartilhar Evento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnAcao, styles.btnNotificar]} onPress={handleNotificar}>
            <Text style={styles.textoBtnAcao}>🔔 Notificar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}