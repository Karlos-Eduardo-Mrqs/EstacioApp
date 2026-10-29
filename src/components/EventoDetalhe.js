import { useRef, useState } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { compartilharCard } from "../services/compartilharService";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";
import { formatarDataApenas } from "../utils/dataUtils"; // 👈 Importa a função de formatação limpa
import { detalheStyles as styles } from "../styles/detalhesStyles";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";
import ConfirmPopup from "./ConfirmPopup";

const imagemExemploPadrao = require("../../assets/image.png");

export default function EventoDetalhe({ evento, onClose, onNotificar }) {
  const viewRef = useRef();
  const [feedback, setFeedback] = useState({ tipo: "", mensagem: "" });

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    titulo: "",
    mensagem: "",
    onConfirm: () => {},
    tipo: "info",
  });

  if (!evento) return null;

  // 🔗 Ação de Compartilhar
  const handleCompartilharClick = () => {
    setConfirmConfig({
      titulo: "📥 Permitir Download",
      mensagem: "Deseja permitir o download da imagem deste evento no seu dispositivo?",
      tipo: "info",
      onConfirm: async () => {
        setConfirmVisible(false);
        setFeedback({ tipo: "", mensagem: "" });
        const resultado = await compartilharCard(viewRef, evento);
        setFeedback({
          tipo: resultado.tipo,
          mensagem: resultado.mensagem
        });
      },
    });
    setConfirmVisible(true);
  };

  // 🔔 Ação de Notificar
  const handleNotificarClick = () => {
    setConfirmConfig({
      titulo: "🔔 Salvar Notificação",
      mensagem: "Deseja guardar este evento nas suas notificações e agendar o lembrete?",
      tipo: "info",
      onConfirm: async () => {
        setConfirmVisible(false);
        setFeedback({ tipo: "", mensagem: "" });

        const resultado = await solicitarPermissaoEAgendarLembrete(evento);

        setFeedback({ 
          tipo: resultado.tipo, 
          mensagem: resultado.mensagem 
        });

        if (resultado.sucesso) {
          if (onNotificar) {
            onNotificar(evento);
          }
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      },
    });
    setConfirmVisible(true);
  };

  const imagemFonte = evento?.imagem ? { uri: evento.imagem } : imagemExemploPadrao;
  const nomeTurma = evento?.turma || evento?.curso || "Sem turma/curso definidos";

  // 📅 Converte o timestamp do banco para o formato dia/mês/ano limpo
  const dataFormatada = formatarDataApenas(evento.inicio || evento.dia);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View
            ref={viewRef}
            style={styles.modalContentClean}
            collapsable={false}
          >
            <TouchableOpacity style={styles.closeButtonClean} onPress={onClose}>
              <CustomIcon name="close" size={18} color="#262626" />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollClean}
            >
              <View style={styles.imageContainerModal}>
                <Image
                  source={imagemFonte}
                  style={styles.imagemPost}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.detailsInnerContainer}>
                <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

                <Text style={styles.modalTituloClean}>{evento.titulo}</Text>

                <Text style={styles.modalSubInfoClean}>
                  📅 {dataFormatada} • 📍 {nomeTurma}
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
                  {evento.descricao ||
                    "Prazo inicial para envio de atividades complementares."}
                </Text>

                <View style={styles.actionButtonsRowClean}>
                  <TouchableOpacity
                    style={styles.btnNotificarClean}
                    onPress={handleNotificarClick}
                  >
                    <CustomIcon
                      name="notifications-outline"
                      size={16}
                      color="#ffffff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.btnNotificarTextoClean}>Notificar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnCompartilharClean}
                    onPress={handleCompartilharClick}
                  >
                    <Text style={styles.btnCompartilharTextoClean}>
                      Compartilhar ↗
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmPopup
        visible={confirmVisible}
        titulo={confirmConfig.titulo}
        mensagem={confirmConfig.mensagem}
        tipo={confirmConfig.tipo}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => {
          setConfirmVisible(false);
          setFeedback({ tipo: "erro", mensagem: "Ação cancelada pelo utilizador." });
        }}
      />
    </>
  );
}