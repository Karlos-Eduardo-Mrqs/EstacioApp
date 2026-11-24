import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEventoDetalhe } from "../hooks/useEventoDetalhe";
import ConfirmPopup from "./ConfirmPopup";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";
import BotaoFechar from "./BotaoFechar";
import ModalVisualizarImagem from "./ModalVisualizarImagemCheia";
import ModalFormularioInscricao from "./modalInscricao";
import { detalheStyles as localStyles } from "../styles/detalhesStyles";

function estaDesativado(item) {
  if (!item) return false;
  if (item.status === false) return true;
  if (typeof item.status === "string") {
    const st = item.status.trim().toLowerCase();
    return st === "cancelado" || st === "desativado" || st === "inativo";
  }
  return false;
}

export default function EventoDetalhe({
  evento,
  onClose,
  onNotificar,
  imagemPadraoUrl,
  usuarioAtual = null,
}) {
  const {
    viewRef,
    width,
    isCompact,
    isVeryNarrow,
    feedback,
    setFeedback,
    imagemTelaCheiaVisivel,
    setImagemTelaCheiaVisivel,
    modalInscricaoVisivel,
    setModalInscricaoVisivel,
    salvandoInscricao,
    confirmVisible,
    setConfirmVisible,
    confirmConfig,
    inscricaoHabilitada,
    linkEvento,
    estatisticasVagas,
    carregandoVagas,
    urlFinal,
    imagemFonte,
    localExibido,
    dataFormatada,
    horasAAC,
    handleAcessarLink,
    handleConfirmarInscricao,
    handleCompartilharClick,
    handleNotificarClick,
  } = useEventoDetalhe({
    evento,
    onClose,
    onNotificar,
    imagemPadraoUrl,
    usuarioAtual,
  });

  if (!evento) return null;

  const eventoCancelado = estaDesativado(evento);

  const {
    temLimite,
    limiteVagas,
    vagasOcupadas,
    vagasRestantes,
    porcentagemOcupada,
    lotado,
  } = estatisticasVagas;

  const corBarra =
    porcentagemOcupada >= 90
      ? "#DC2626"
      : porcentagemOcupada >= 70
        ? "#D97706"
        : "#173EA5";

  const mostrarDetalhesSecundarios = Boolean(
    evento.palestrante || horasAAC || (inscricaoHabilitada && temLimite)
  );

  const bloqueiaInscricao = lotado || eventoCancelado;

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={!imagemTelaCheiaVisivel && !modalInscricaoVisivel}
        onRequestClose={onClose}
      >
        <View style={localStyles.modalOverlay}>
          <View
            ref={viewRef}
            style={[
              localStyles.modalContentClean,
              {
                maxHeight: "92%",
                width: width < 640 ? "95%" : undefined,
                overflow: "hidden",
              },
              eventoCancelado && {
                borderColor: "#FECACA",
                borderWidth: 1.5,
              },
            ]}
            collapsable={false}
          >
            {/* TOPO COM BANNER 16:9 E BOTÃO FECHAR FLUTUANTE */}
            <View
              style={[
                localStyles.bannerContainer,
                isCompact && { height: 155 },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={!urlFinal}
                onPress={() => setImagemTelaCheiaVisivel(true)}
                style={{ width: "100%", height: "100%" }}
              >
                <Image
                  source={imagemFonte}
                  style={[
                    localStyles.imagemPost,
                    eventoCancelado && { opacity: 0.45 },
                  ]}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {eventoCancelado && (
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "#DC2626",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 7,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <CustomIcon
                    name="close-circle-outline"
                    size={15}
                    color="#FFFFFF"
                  />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: "800",
                      letterSpacing: 0.4,
                    }}
                  >
                    EVENTO CANCELADO
                  </Text>
                </View>
              )}

              <BotaoFechar
                onPress={onClose}
                style={localStyles.closeButtonClean}
              />
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

                {eventoCancelado && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: "#FEF2F2",
                      borderWidth: 1,
                      borderColor: "#FECACA",
                      borderLeftWidth: 4,
                      borderLeftColor: "#DC2626",
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <CustomIcon
                      name="alert-circle-outline"
                      size={20}
                      color="#DC2626"
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "800",
                          color: "#991B1B",
                        }}
                      >
                        EVENTO CANCELADO / DESATIVADO
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#B91C1C",
                          marginTop: 2,
                        }}
                      >
                        Todas as ações deste evento estão desativadas.
                      </Text>
                    </View>
                  </View>
                )}

                <Text
                  style={[
                    localStyles.modalTituloClean,
                    eventoCancelado && {
                      color: "#64748B",
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {evento.titulo}
                </Text>

                {/* 📅 GRID DE DATA E LOCAL DESTAQUE */}
                <View
                  style={[
                    localStyles.infoGrid,
                    isVeryNarrow && {
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: 6,
                    },
                  ]}
                >
                  <View style={localStyles.infoBadgeItem}>
                    <CustomIcon
                      name="calendar-outline"
                      size={16}
                      color={eventoCancelado ? "#94A3B8" : "#173EA5"}
                    />
                    <Text
                      style={[
                        localStyles.infoBadgeTexto,
                        eventoCancelado && { color: "#64748B" },
                      ]}
                    >
                      {dataFormatada || "Data a definir"}
                    </Text>
                  </View>

                  <View style={localStyles.infoBadgeItem}>
                    <CustomIcon
                      name="location-outline"
                      size={16}
                      color={eventoCancelado ? "#94A3B8" : "#173EA5"}
                    />
                    <Text
                      style={[
                        localStyles.infoBadgeTexto,
                        eventoCancelado && { color: "#64748B" },
                      ]}
                      numberOfLines={1}
                    >
                      {localExibido}
                    </Text>
                  </View>
                </View>

                {/* 🕒 CAIXA SECUNDÁRIA */}
                {mostrarDetalhesSecundarios && (
                  <View style={localStyles.detalhesSecundariosBox}>
                    {evento.palestrante && (
                      <View style={localStyles.linhaDetalhe}>
                        <CustomIcon
                          name="person-outline"
                          size={15}
                          color="#64748B"
                        />
                        <Text style={localStyles.labelDetalhe}>
                          Responsável:
                        </Text>
                        <Text style={localStyles.valorDetalhe} numberOfLines={1}>
                          {evento.palestrante}
                        </Text>
                      </View>
                    )}

                    {horasAAC && (
                      <View style={localStyles.linhaDetalhe}>
                        <CustomIcon
                          name="time-outline"
                          size={15}
                          color="#64748B"
                        />
                        <Text style={localStyles.labelDetalhe}>
                          Certificação:
                        </Text>
                        <Text style={localStyles.valorDestaqueAAC}>
                          {horasAAC}h AAC
                        </Text>
                      </View>
                    )}

                    {inscricaoHabilitada && temLimite && (
                      <View style={localStyles.linhaDetalhe}>
                        <CustomIcon
                          name="people-outline"
                          size={15}
                          color={eventoCancelado ? "#94A3B8" : lotado ? "#DC2626" : "#64748B"}
                        />
                        <Text style={localStyles.labelDetalhe}>Vagas:</Text>
                        <Text
                          style={[
                            localStyles.valorDetalhe,
                            {
                              color: eventoCancelado ? "#64748B" : corBarra,
                              fontWeight: "700",
                            },
                          ]}
                        >
                          {carregandoVagas
                            ? "A atualizar..."
                            : `${porcentagemOcupada}% ocupadas (${vagasOcupadas}/${limiteVagas} • ${vagasRestantes} restantes)`}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* SOBRE O EVENTO */}
                <Text style={localStyles.modalSecaoLabelClean}>
                  SOBRE O EVENTO:
                </Text>
                <Text
                  style={[
                    localStyles.modalDescricaoClean,
                    eventoCancelado && { color: "#64748B" },
                  ]}
                >
                  {evento.descricao ||
                    "Informações detalhadas sobre o evento académico."}
                </Text>

                {/* 📝 BOTÃO DE INSCRIÇÃO */}
                {inscricaoHabilitada && (
                  <TouchableOpacity
                    disabled={bloqueiaInscricao}
                    style={[
                      localStyles.btnNotificarClean,
                      {
                        backgroundColor: bloqueiaInscricao ? "#CBD5E1" : "#173EA5",
                        marginTop: 14,
                        paddingVertical: isCompact ? 11 : 12,
                        borderRadius: 10,
                        justifyContent: "center",
                        width: "100%",
                        opacity: bloqueiaInscricao ? 0.7 : 1,
                      },
                    ]}
                    onPress={() => {
                      if (eventoCancelado) return;
                      setFeedback({ tipo: "", mensagem: "" });
                      setModalInscricaoVisivel(true);
                    }}
                    activeOpacity={0.85}
                  >
                    <CustomIcon
                      name={bloqueiaInscricao ? "lock-closed-outline" : "create-outline"}
                      size={18}
                      color={bloqueiaInscricao ? "#64748B" : "#FFFFFF"}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        localStyles.btnNotificarTextoClean,
                        bloqueiaInscricao && { color: "#64748B" },
                        isVeryNarrow && { fontSize: 13 },
                      ]}
                    >
                      {eventoCancelado
                        ? "Inscrições desativadas"
                        : lotado
                          ? "Vagas esgotadas"
                          : "Inscreva-se"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {/* RODAPÉ COM TODAS AS AÇÕES DESABILITADAS SE CANCELADO */}
            <View
              style={[
                localStyles.actionButtonsRowClean,
                isCompact && {
                  flexWrap: "wrap",
                  gap: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                },
              ]}
            >
              {linkEvento ? (
                <TouchableOpacity
                  disabled={eventoCancelado}
                  style={[
                    localStyles.btnNotificarClean,
                    {
                      backgroundColor: eventoCancelado ? "#E2E8F0" : "#059669",
                      opacity: eventoCancelado ? 0.55 : 1,
                    },
                  ]}
                  onPress={() => {
                    if (!eventoCancelado) handleAcessarLink();
                  }}
                  activeOpacity={0.8}
                >
                  <CustomIcon
                    name="globe-outline"
                    size={17}
                    color={eventoCancelado ? "#64748B" : "#ffffff"}
                  />
                  <Text
                    style={[
                      localStyles.btnNotificarTextoClean,
                      eventoCancelado && { color: "#64748B" },
                    ]}
                  >
                    Acessar link
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                disabled={eventoCancelado}
                style={[
                  localStyles.btnNotificarClean,
                  eventoCancelado && {
                    backgroundColor: "#E2E8F0",
                    opacity: 0.55,
                  },
                ]}
                onPress={() => {
                  if (!eventoCancelado) handleNotificarClick();
                }}
                activeOpacity={0.8}
              >
                <CustomIcon
                  name="notifications-outline"
                  size={17}
                  color={eventoCancelado ? "#64748B" : "#ffffff"}
                />
                <Text
                  style={[
                    localStyles.btnNotificarTextoClean,
                    eventoCancelado && { color: "#64748B" },
                  ]}
                >
                  Notificar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={eventoCancelado}
                style={[
                  localStyles.btnCompartilharClean,
                  eventoCancelado && {
                    backgroundColor: "#F1F5F9",
                    borderColor: "#E2E8F0",
                    opacity: 0.55,
                  },
                ]}
                onPress={() => {
                  if (!eventoCancelado) handleCompartilharClick();
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    localStyles.btnCompartilharTextoClean,
                    eventoCancelado && { color: "#94A3B8" },
                  ]}
                >
                  Compartilhar ↗
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalFormularioInscricao
        visible={modalInscricaoVisivel && !eventoCancelado}
        onClose={() => setModalInscricaoVisivel(false)}
        evento={evento}
        onSalvar={handleConfirmarInscricao}
        salvando={salvandoInscricao}
      />

      <ModalVisualizarImagem
        visible={imagemTelaCheiaVisivel}
        imageUrl={urlFinal}
        onClose={() => setImagemTelaCheiaVisivel(false)}
      />

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