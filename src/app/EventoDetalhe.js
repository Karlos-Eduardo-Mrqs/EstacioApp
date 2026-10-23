import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { Alert, Modal, Text, TouchableOpacity, View, useWindowDimensions, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import { detalheStyles as styles } from "../styles/mural/detalhesStyles";
import CustomIcon from "../components/CustomIcon";
import { CoresInstitucionais } from "../styles/theme";

export default function EventoDetalhe({ evento, onClose, onNotificar }) { // 👈 Adicione o onNotificar aqui
  const viewRef = useRef();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const handleCompartilhar = async () => {
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
        Alert.alert("Sucesso!", "A imagem do evento foi descarregada para o seu computador.");
      } else {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Compartilhar Evento",
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar ou partilhar o evento.");
    }
  };

  const handleNotificar = () => {
    if (onNotificar) {
      onNotificar(evento);
    }
    onClose();
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