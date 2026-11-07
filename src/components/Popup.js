import { useEffect } from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import { popupStyles as styles } from "../styles/popupStyles";
import BotaoFechar from "./botaoFechar";

export default function ToastPopup({ visible, titulo, mensagem, onClose, duracao = 6 }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duracao * 1000);

      return () => clearTimeout(timer);
    }
  }, [visible, duracao, onClose]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.toastContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.titulo}>{titulo}</Text>
            {/* BOTÃO DE FECHAR (X) */}
            <TouchableOpacity onPress={onClose} style={styles.botaoFechar}>
              <BotaoFechar onPress={onClose} />
            </TouchableOpacity>
          </View>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <Text style={styles.timerTexto}>⏱️ Esta mensagem sumirá em {duracao}s</Text>
        </View>
      </View>
    </Modal>
  );
}