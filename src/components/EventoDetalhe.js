import { useRef, useState } from "react";
import {Image,Modal,ScrollView,Text,TouchableOpacity,View,Platform} from "react-native";
import { compartilharCard } from "../services/compartilharServices";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";
import { formatarDataApenas } from "../utils/dataUtils";
import ConfirmPopup from "./ConfirmPopup";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";
import { detalheStyles as localStyles } from "../styles/detalhesStyles";

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

  // 🛡️ Tratamento seguro para extrair o local do evento
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

  // 📅 Converte a data
  const dataFormatada = formatarDataApenas(
    evento.inicio || evento.dia || evento.dataEvento,
  );
  
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={onClose}
      >
        <View style={localStyles.modalOverlay}>
          <View
            ref={viewRef}
            style={localStyles.modalContentClean}
            collapsable={false}
          >
            {/* Botão de Fechar otimizado para Mobile e Computador */}
            <TouchableOpacity 
              style={localStyles.closeButtonClean} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <CustomIcon name={Platform.OS === 'web' ? 'close' : 'arrow-back'} size={24} color="#64748B" />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={localStyles.modalScrollClean}
            >
              <View style={localStyles.imageContainerModal}>
                <Image
                  source={imagemFonte}
                  style={localStyles.imagemPost}
                  resizeMode="cover"
                />
              </View>

              <View style={localStyles.detailsInnerContainer}>
                <FeedbackBox
                  tipo={feedback.tipo}
                  mensagem={feedback.mensagem}
                />

                <Text style={localStyles.modalTituloClean}>{evento.titulo}</Text>

                <Text style={localStyles.modalSubInfoClean}>
                  📅 {dataFormatada} • 📍 {localExibido}
                </Text>

                {evento.palestrante && (
                  <Text style={localStyles.modalSubInfoClean}>
                    🎤 Palestrante: {evento.palestrante}
                  </Text>
                )}

                {(evento.horasAAC || evento.horas_acc) && (
                  <Text style={localStyles.modalSubInfoClean}>
                    🕛 Horas ACC: {evento.horasAAC || evento.horas_acc}h
                  </Text>
                )}

                <Text style={localStyles.modalSecaoLabelClean}>Sobre o evento:</Text>
                <Text style={localStyles.modalDescricaoClean}>
                  {evento.descricao ||
                    "Informações detalhadas sobre o evento acadêmico."}
                </Text>

                <View style={localStyles.actionButtonsRowClean}>
                  <TouchableOpacity
                    style={localStyles.btnNotificarClean}
                    onPress={handleNotificarClick}
                  >
                    <CustomIcon
                      name="notifications-outline"
                      size={16}
                      color="#ffffff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={localStyles.btnNotificarTextoClean}>Notificar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={localStyles.btnCompartilharClean}
                    onPress={handleCompartilharClick}
                  >
                    <Text style={localStyles.btnCompartilharTextoClean}>
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
