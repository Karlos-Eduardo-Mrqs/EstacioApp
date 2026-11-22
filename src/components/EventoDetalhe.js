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
                  style={localStyles.imagemPost}
                  resizeMode="cover"
                />
              </TouchableOpacity>
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

                <Text style={localStyles.modalTituloClean}>{evento.titulo}</Text>

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
                      color="#173EA5"
                    />
                    <Text style={localStyles.infoBadgeTexto}>
                      {dataFormatada || "Data a definir"}
                    </Text>
                  </View>

                  <View style={localStyles.infoBadgeItem}>
                    <CustomIcon
                      name="location-outline"
                      size={16}
                      color="#173EA5"
                    />
                    <Text style={localStyles.infoBadgeTexto} numberOfLines={1}>
                      {localExibido}
                    </Text>
                  </View>
                </View>

                {/* 🕒 CAIXA SECUNDÁRIA (Responsável, Certificação e Ocupação de Vagas) */}
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
                          color={lotado ? "#DC2626" : "#64748B"}
                        />
                        <Text style={localStyles.labelDetalhe}>Vagas:</Text>
                        <Text
                          style={[
                            localStyles.valorDetalhe,
                            { color: corBarra, fontWeight: "700" },
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
                <Text style={localStyles.modalDescricaoClean}>
                  {evento.descricao ||
                    "Informações detalhadas sobre o evento académico."}
                </Text>

                {/* 📝 BOTÃO DE INSCRIÇÃO */}
                {inscricaoHabilitada && (
                  <TouchableOpacity
                    disabled={lotado}
                    style={[
                      localStyles.btnNotificarClean,
                      {
                        backgroundColor: lotado ? "#94A3B8" : "#173EA5",
                        marginTop: 14,
                        paddingVertical: isCompact ? 11 : 12,
                        borderRadius: 10,
                        justifyContent: "center",
                        width: "100%",
                      },
                    ]}
                    onPress={() => {
                      setFeedback({ tipo: "", mensagem: "" });
                      setModalInscricaoVisivel(true);
                    }}
                    activeOpacity={0.85}
                  >
                    <CustomIcon
                      name={lotado ? "lock-closed-outline" : "create-outline"}
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        localStyles.btnNotificarTextoClean,
                        isVeryNarrow && { fontSize: 13 },
                      ]}
                    >
                      {lotado ? "Vagas esgotadas" : "Inscreva-se"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {/* RODAPÉ COM AÇÕES */}
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
                  style={[
                    localStyles.btnNotificarClean,
                    { backgroundColor: "#059669" },
                  ]}
                  onPress={handleAcessarLink}
                  activeOpacity={0.8}
                >
                  <CustomIcon name="globe-outline" size={17} color="#ffffff" />
                  <Text style={localStyles.btnNotificarTextoClean}>
                    Acessar link
                  </Text>
                </TouchableOpacity>
              ) : null}

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

      <ModalFormularioInscricao
        visible={modalInscricaoVisivel}
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