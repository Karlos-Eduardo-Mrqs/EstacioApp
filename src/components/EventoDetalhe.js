import { useRef, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { compartilharCard } from "../services/compartilharServices";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";
import { detalheStyles as styles } from "../styles/detalhesStyles";
import { formatarDataApenas } from "../utils/dataUtils";
import ConfirmPopup from "./ConfirmPopup";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";

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
      mensagem:
        "Deseja permitir o download da imagem deste evento no seu dispositivo?",
      tipo: "info",
      onConfirm: async () => {
        setConfirmVisible(false);
        setFeedback({ tipo: "", mensagem: "" });
        const resultado = await compartilharCard(viewRef, evento);
        setFeedback({
          tipo: resultado.tipo,
          mensagem: resultado.mensagem,
        });
      },
    });
    setConfirmVisible(true);
  };

  // 🔔 Ação de Notificar
  const handleNotificarClick = () => {
    setConfirmConfig({
      titulo: "🔔 Salvar Notificação",
      mensagem:
        "Deseja guardar este evento nas suas notificações e agendar o lembrete?",
      tipo: "info",
      onConfirm: async () => {
        setConfirmVisible(false);
        setFeedback({ tipo: "", mensagem: "" });

        const resultado = await solicitarPermissaoEAgendarLembrete(evento);

        setFeedback({
          tipo: resultado.tipo,
          mensagem: resultado.mensagem,
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

  const urlImagemCapa =
    typeof evento?.imagem === "object"
      ? evento.imagem?.caminho_img
      : evento?.imagem;

  const imagemFonte = urlImagemCapa
    ? { uri: urlImagemCapa }
    : imagemExemploPadrao;
  // 🛡️ Tratamento seguro para extrair a string do curso/turma caso venha como objeto do Supabase
  let nomeTurma = "Sem turma/curso definidos";
  if (evento?.turma) {
    nomeTurma =
      typeof evento.turma === "object"
        ? evento.turma.nome || "Curso"
        : evento.turma;
  } else if (evento?.curso) {
    nomeTurma =
      typeof evento.curso === "object"
        ? evento.curso.nome || "Curso"
        : evento.curso;
  }

  // 🛡️ Tratamento seguro para extrair o local/turma/curso do evento
  let localExibido = "Estácio Nova América";

  if (evento?.local) {
    localExibido =
      typeof evento.local === "object"
        ? evento.local.nome || "Estácio Nova América"
        : evento.local;
  } else if (evento?.turma) {
    localExibido =
      typeof evento.turma === "object"
        ? evento.turma.nome || "Estácio Nova América"
        : evento.turma;
  } else if (evento?.curso) {
    localExibido =
      typeof evento.curso === "object"
        ? evento.curso.nome || "Estácio Nova América"
        : evento.curso;
  }

  // 📅 Converte o timestamp do banco para o formato dia/mês/ano limpo
  const dataFormatada = formatarDataApenas(
    evento.inicio || evento.dia || evento.dataEvento,
  );

  {
    /* Exemplo de renderização correta da imagem de capa no modal de detalhes */
  }
  {
    (evento.imagem?.caminho_img || evento.imagem) && (
      <Image
        source={{ uri: evento.imagem?.caminho_img || evento.imagem }}
        style={{
          width: "1005",
          height: 180, // Altura proporcional ao formato 16:9
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          resizeMode: "cover",
        }}
      />
    );
  }

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
                <FeedbackBox
                  tipo={feedback.tipo}
                  mensagem={feedback.mensagem}
                />

                <Text style={styles.modalTituloClean}>{evento.titulo}</Text>

                <Text style={styles.modalSubInfoClean}>
                  📅 {dataFormatada} • 📍 {localExibido}
                </Text>

                {evento.autor && (
                  <Text style={styles.modalSubInfoClean}>
                    🎤 Palestrante: {evento.palestrante}
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
          setFeedback({
            tipo: "erro",
            mensagem: "Ação cancelada pelo utilizador.",
          });
        }}
      />
    </>
  );
}
