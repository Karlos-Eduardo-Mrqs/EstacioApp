import { useEffect, useRef, useState } from "react";
import { Image, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"; // 👈 Importado Linking
import { supabase } from "../../lib/supabase"; 
import { compartilharCard } from "../services/compartilharServices";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";
import { formatarDataApenas } from "../utils/dataUtils";
import ConfirmPopup from "./ConfirmPopup";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";
import BotaoFechar from "./BotaoFechar";
import { detalheStyles as localStyles } from "../styles/detalhesStyles";

export default function EventoDetalhe({ evento, onClose, onNotificar, imagemPadraoUrl }) {
  const viewRef = useRef();
  const [feedback, setFeedback] = useState({ tipo: "", mensagem: "" });
  const [fallbackUrl, setFallbackUrl] = useState(imagemPadraoUrl || null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    titulo: "",
    mensagem: "",
    onConfirm: () => {},
    tipo: "info",
  });

  useEffect(() => {
    if (imagemPadraoUrl) {
      setFallbackUrl(imagemPadraoUrl);
      return;
    }
    async function carregarFallback() {
      const { data } = await supabase
        .from("imagem")
        .select("caminho_img")
        .eq("id", 21)
        .single();
      if (data?.caminho_img) setFallbackUrl(data.caminho_img);
    }
    carregarFallback();
  }, [imagemPadraoUrl]);

  if (!evento) return null;

  // 🔗 Extração segura do link do evento (verifica link_transmissao ou link)
  const linkEvento = evento.link_transmissao || evento.link;

  const handleAcessarLink = async () => {
    if (!linkEvento) return;
    try {
      const supported = await Linking.canOpenURL(linkEvento);
      if (supported) {
        await Linking.openURL(linkEvento);
      } else {
        setFeedback({ tipo: "erro", mensagem: "Não foi possível abrir este link." });
      }
    } catch (error) {
      setFeedback({ tipo: "erro", mensagem: "Erro ao tentar abrir o link." });
    }
  };

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
      mensagem: "Deseja guardar este evento nas suas notificações e agendar o lembrete?",
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

  const urlFinal = urlImagemCapa || fallbackUrl;
  const imagemFonte = urlFinal ? { uri: urlFinal } : null;

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
                  onClose={() => setFeedback({ tipo: "", mensagem: "" })}
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
                  {evento.descricao || "Informações detalhadas sobre o evento acadêmico."}
                </Text>
              </View>
            </ScrollView>

            {/* RODAPÉ COM AÇÕES */}
            <View style={localStyles.actionButtonsRowClean}>
              {/* 🌐 BOTÃO CONDICIONAL DE ACESSAR LINK (Aparece se houver link cadastrado) */}
              {linkEvento ? (
                <TouchableOpacity
                  style={[localStyles.btnNotificarClean, { backgroundColor: "#059669" }]} // Estilo verde diferenciado para destaque do link
                  onPress={handleAcessarLink}
                  activeOpacity={0.8}
                >
                  <CustomIcon name="globe-outline" size={17} color="#ffffff" />
                  <Text style={localStyles.btnNotificarTextoClean}>Acessar link</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={localStyles.btnNotificarClean}
                onPress={handleNotificarClick}
                activeOpacity={0.8}
              >
                <CustomIcon name="notifications-outline" size={17} color="#ffffff" />
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