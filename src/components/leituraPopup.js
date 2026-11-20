import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { leituraPopupStyles as styles } from "../styles/leituraPopupStyles";
import CustomIcon from "./CustomIcon";

export default function LeituraPopup({ aviso, visible, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>📢 {aviso?.titulo}</Text>
            <TouchableOpacity onPress={onClose}>
              <CustomIcon name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.mensagem}>{aviso?.mensagem}</Text>
          </ScrollView>

          <Text style={styles.expiracao}>
            Expira em:{" "}
            {aviso?.expira_em
              ? new Date(aviso.expira_em).toLocaleString()
              : ""}
          </Text>

          <TouchableOpacity
            style={styles.botaoConfirmar}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoConfirmar}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}