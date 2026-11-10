// src/components/ModalVisualizarImagem.js
import { Image, Modal, View } from "react-native";
import BotaoFechar from "./BotaoFechar";

export default function ModalVisualizarImagem({ visible, imageUrl, onClose }) {
  if (!visible || !imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <BotaoFechar
          onPress={onClose}
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 10,
            backgroundColor: "#FFFFFF",
          }}
        />

        <Image
          source={{ uri: imageUrl }}
          style={{
            width: "100%",
            height: "85%",
          }}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}