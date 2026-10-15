import { useEffect } from "react";
import { Modal, Text, View } from "react-native";
import { popupStyles as styles } from "../styles/popupStyles"; // 👈 ADICIONE ESTA IMPORTAÇÃO

export default function ToastPopup({ visible, titulo, mensagem, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

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
          </View>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <Text style={styles.timerTexto}>⏱️ Esta mensagem sumirá em 6s</Text>
        </View>
      </View>
    </Modal>
  );
}
