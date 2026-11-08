import { useRef, useState } from "react";
import {Image,Modal,ScrollView,Text,TouchableOpacity,View,Platform} from "react-native";
import { compartilharCard } from "../services/compartilharServices";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";
import { formatarDataApenas } from "../utils/dataUtils";
import ConfirmPopup from "./ConfirmPopup";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";
import BotaoFechar from "./botaoFechar";
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
  
  const horasAAC = evento.horasAAC || evento.horas_acc;

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
            {/* TOPO COM BANNER 16:9 E BOTÃO FECHAR FLUTUANTE */}
            <View style={localStyles.bannerContainer}>
              <Image
                source={imagemFonte}
                style={localStyles.imagemPost}
                resizeMode="cover"
              />
              <BotaoFechar onPress={onClose} style={localStyles.closeButtonClean} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={localStyles.modalScrollClean}
            >
              <View style={localStyles.detailsInnerContainer}>
                <FeedbackBox
                  tipo={feedback.tipo}
                  mensagem={feedback.mensagem}
                />

                <Text style={localStyles.modalTituloClean}>{evento.titulo}</Text>

                {/* 📅 GRID DE DATA E LOCAL DESTAQUE */}
                <View style={localStyles.infoGrid}>
                  <View style={localStyles.infoBadgeItem}>
                    <CustomIcon name="calendar-outline" size={16} color="#173EA5" />
                    <Text style={localStyles.infoBadgeTexto}>{dataFormatada || "Data a definir"}</Text>
                  </View>

                  <View style={localStyles.infoBadgeItem}>
                    <CustomIcon name="location-outline" size={16} color="#173EA5" />
                    <Text style={localStyles.infoBadgeTexto} numberOfLines={1}>{localExibido}</Text>
                  </View>
                </View>

                {/* 🕒 CAIXA SECUNDÁRIA (Palestrante e Horas AAC) */}
                {(evento.palestrante || horasAAC) && (
                  <View style={localStyles.detalhesSecundariosBox}>
                    {evento.palestrante && (
                      <View style={localStyles.linhaDetalhe}>
                        <CustomIcon name="person-outline" size={15} color="#64748B" />
                        <Text style={localStyles.labelDetalhe}>Responsável:</Text>
                        <Text style={localStyles.valorDetalhe} numberOfLines={1}>{evento.palestrante}</Text>
                      </View>
                    )}

                    {horasAAC && (
                      <View style={localStyles.linhaDetalhe}>
                        <CustomIcon name="time-outline" size={15} color="#64748B" />
                        <Text style={localStyles.labelDetalhe}>Certificação:</Text>
                        <Text style={localStyles.valorDestaqueAAC}>{horasAAC}h AAC</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* SOBRE O EVENTO */}
                <Text style={localStyles.modalSecaoLabelClean}>SOBRE O EVENTO:</Text>
                <Text style={localStyles.modalDescricaoClean}>
                  {evento.descricao ||
                    "Informações detalhadas sobre o evento acadêmico."}
                </Text>
              </View>
            </ScrollView>

            {/* RODAPÉ COM AÇÕES */}
            <View style={localStyles.actionButtonsRowClean}>
              <TouchableOpacity
                style={localStyles.btnNotificarClean}
                onPress={handleNotificarClick}
                activeOpacity={0.8}
              >
                <CustomIcon
                  name="notifications-outline"
                  size={17}
                  color="#ffffff"
                />
                <Text style={localStyles.btnNotificarTextoClean}>Notificar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={localStyles.btnCompartilharClean}
                onPress={handleCompartilharClick}
                activeOpacity={0.8}
              >
                <Text style={localStyles.btnCompartilharTextoClean}>
                  Compartilhar ↗
                </Text>
              </TouchableOpacity>
            </View>
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