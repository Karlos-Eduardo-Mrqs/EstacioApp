import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGerenciarInscricoes } from "../../../hooks/useGerenciaInscricao";
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import { painelInscStyles as s } from "../../../styles/painel/painelInscricaoStyles";
import { formatarDataApenas } from "../../../utils/dataUtils";
import ConfirmPopup from "../../ConfirmPopup";
import CustomIcon from "../../CustomIcon";
import ToastPopup from "../../Popup";
import ModalFormularioInscricao from "../../modalInscricao";
import GerenciarListaInscricao from "./gerenciarListaInscricao";

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "ativas", label: "Ativas" },
  { id: "canceladas", label: "Canceladas" },
  { id: "alunos", label: "Alunos" },
  { id: "externos", label: "Externos" },
];

function formatarLocalEvento(evento) {
  if (!evento?.local) return "Estácio Nova América";
  if (typeof evento.local === "object") {
    return evento.local.nome || "Estácio Nova América";
  }
  return String(evento.local).trim() || "Estácio Nova América";
}

function formatarPeriodoEvento(evento) {
  if (!evento) return null;
  const inicio = formatarDataApenas(
    evento.data_inicio || evento.inicio || evento.data
  );
  const fim = evento.data_fim ? formatarDataApenas(evento.data_fim) : "";

  if (inicio && fim && fim !== inicio) {
    return `${inicio} até ${fim}`;
  }
  return inicio || null;
}

export default function PainelInscricoes({ usuarioAtual = null }) {
  const [filtroStatusTipo, setFiltroStatusTipo] = useState("todas");

  const {
    eventosComInscricoes,
    grupoSelecionado,
    setEventoSelecionadoId,
    carregando,
    busca,
    setBusca,
    modalVisivel,
    inscricaoEditando,
    salvando,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovaInscricao,
    abrirEdicaoInscricao,
    fecharModalInscricao,
    salvarInscricao,
    alternarStatusInscricao,
    excluirInscricao,
    exportarExcel,
  } = useGerenciarInscricoes(usuarioAtual);

  const inscricoesFiltradasPorChip = (
    grupoSelecionado?.inscricoes || []
  ).filter((item) => {
    const ativa = item.status !== false;
    if (filtroStatusTipo === "ativas") return ativa;
    if (filtroStatusTipo === "canceladas") return !ativa;
    if (filtroStatusTipo === "alunos") return Boolean(item.eh_aluno);
    if (filtroStatusTipo === "externos") return !item.eh_aluno;
    return true;
  });

  function formatarPalestranteEvento(evento) {
      if (!evento) return null;
      const raw = evento.palestrante || evento.responsavel;
      if (!raw) return null;
      if (typeof raw === "object") {
        return raw.nome ? String(raw.nome).trim() : null;
      }
      return String(raw).trim() || null;
  }

  const eventoAtual = grupoSelecionado?.evento || null;
  const periodoFmt = formatarPeriodoEvento(eventoAtual);
  const localFmt = eventoAtual ? formatarLocalEvento(eventoAtual) : null;
  const limiteVagasNum = Number(eventoAtual?.limite_vagas);
  const temLimiteVagas =
    Number.isFinite(limiteVagasNum) && limiteVagasNum > 0;
  const percentualOcupacao = temLimiteVagas
    ? Math.min(
        100,
        Math.round(((grupoSelecionado?.totalAtivas || 0) / limiteVagasNum) * 100)
      )
    : null;

  const corOcupacao =
    (percentualOcupacao || 0) >= 90
      ? "#DC2626"
      : (percentualOcupacao || 0) >= 70
        ? "#D97706"
        : "#173EA5";

  const handleVoltarParaLista = () => {
    setFiltroStatusTipo("todas");
    setEventoSelecionadoId(null);
  };
  
  const palestranteFmt = formatarPalestranteEvento(eventoAtual);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {!grupoSelecionado && (
          <>
            <Text style={styles.tituloPagina}>Painel de Inscrições</Text>

            <TextInput
              style={s.searchInput}
              placeholder="Buscar evento com inscrições..."
              placeholderTextColor="#94A3B8"
              value={busca}
              onChangeText={setBusca}
            />
          </>
        )}

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#173EA5"
            style={{ marginVertical: 24 }}
          />
        ) : grupoSelecionado ? (
          <View>
            <TouchableOpacity
              style={s.backButton}
              onPress={handleVoltarParaLista}
              activeOpacity={0.75}
            >
              <CustomIcon name="arrow-back" size={18} color="#173EA5" />
              <Text style={s.backButtonText}>
                Voltar para eventos com inscrições
              </Text>
            </TouchableOpacity>

            <View style={s.eventHeaderCard}>
              <Text style={s.eventTitle}>
                {eventoAtual?.titulo || "Evento sem título"}
              </Text>

              {eventoAtual?.descricao ? (
                <Text style={s.eventDescription}>{eventoAtual.descricao}</Text>
              ) : null}

              <View style={s.eventMetaRow}>
                {periodoFmt ? (
                  <View style={s.eventMetaBadge}>
                    <CustomIcon
                      name="calendar-outline"
                      size={14}
                      color="#173EA5"
                    />
                    <Text style={s.eventMetaText}>{periodoFmt}</Text>
                  </View>
                ) : null}

                {localFmt ? (
                  <View style={s.eventMetaBadge}>
                    <CustomIcon
                      name="location-outline"
                      size={14}
                      color="#173EA5"
                    />
                    <Text style={s.eventMetaText}>{localFmt}</Text>
                  </View>
                ) : null}

                {palestranteFmt ? (
                  <View style={s.speakerBadge}>
                    <CustomIcon
                      name="mic-outline"
                      size={14}
                      color="#173EA5"
                    />
                    <Text style={s.speakerBadgeText}>Palestrante: {palestranteFmt}</Text>
                  </View>
                ) : null}

                {temLimiteVagas ? (
                  <View style={s.eventMetaBadge}>
                    <CustomIcon
                      name="people-outline"
                      size={14}
                      color={corOcupacao}
                    />
                    <Text style={[s.eventMetaText, { color: corOcupacao }]}>
                      {percentualOcupacao}% ocupado
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={s.statsGrid}>
                <View style={s.statCard}>
                  <Text style={s.statValue}>
                    {grupoSelecionado.totalInscricoes}
                  </Text>
                  <Text style={s.statLabel}>Total de registos</Text>
                </View>

                <View style={s.statCard}>
                  <Text style={[s.statValue, s.statActive]}>
                    {grupoSelecionado.totalAtivas}
                  </Text>
                  <Text style={s.statLabel}>Inscrições ativas</Text>
                </View>

                <View style={s.statCard}>
                  <Text style={[s.statValue, s.statCanceled]}>
                    {grupoSelecionado.totalCanceladas}
                  </Text>
                  <Text style={s.statLabel}>Canceladas</Text>
                </View>

                <View style={s.statCard}>
                  <Text style={s.statValue}>
                    {grupoSelecionado.totalAlunos} /{" "}
                    {grupoSelecionado.totalExternos}
                  </Text>
                  <Text style={s.statLabel}>Alunos / Externos</Text>
                  <Text style={s.statSubLabel}>
                    {grupoSelecionado.totalAlunos} alunos •{" "}
                    {grupoSelecionado.totalExternos} externos
                  </Text>
                </View>
              </View>

              {temLimiteVagas && grupoSelecionado.vagasRestantes !== null && (
                <View style={s.capacityBanner}>
                  <View style={s.capacityHeaderRow}>
                    <Text style={s.capacityText}>
                      Limite de vagas: {limiteVagasNum}
                    </Text>
                    <Text style={s.capacitySubText}>
                      Vagas restantes: {grupoSelecionado.vagasRestantes}
                    </Text>
                  </View>

                  <View style={s.progressTrack}>
                    <View
                      style={[
                        s.progressFill,
                        {
                          width: `${percentualOcupacao}%`,
                          backgroundColor: corOcupacao,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              <View style={s.actionsRow}>
                <TouchableOpacity
                  style={s.exportButton}
                  onPress={() => exportarExcel(grupoSelecionado)}
                  activeOpacity={0.85}
                >
                  <CustomIcon
                    name="download-outline"
                    size={17}
                    color="#FFFFFF"
                  />
                  <Text style={s.actionBtnText}>Exportar Excel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.newButton}
                  onPress={abrirNovaInscricao}
                  activeOpacity={0.85}
                >
                  <CustomIcon name="add" size={18} color="#FFFFFF" />
                  <Text style={s.actionBtnText}>Nova inscrição</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.filterHeaderRow}>
              <View style={s.filterChipsRow}>
                {FILTROS.map((f) => {
                  const selecionado = filtroStatusTipo === f.id;
                  return (
                    <TouchableOpacity
                      key={f.id}
                      style={[
                        s.filterChip,
                        selecionado && s.filterChipActive,
                      ]}
                      onPress={() => setFiltroStatusTipo(f.id)}
                    >
                      <Text
                        style={[
                          s.filterChipText,
                          selecionado && s.filterChipTextActive,
                        ]}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={s.filterCountText}>
                {inscricoesFiltradasPorChip.length} exibido(s)
              </Text>
            </View>

            <GerenciarListaInscricao
              inscricoes={inscricoesFiltradasPorChip}
              onEditar={abrirEdicaoInscricao}
              onAlternarStatus={alternarStatusInscricao}
              onExcluir={excluirInscricao}
            />
          </View>
        ) : eventosComInscricoes.length > 0 ? (
          eventosComInscricoes.map((grupo) => {
            const ev = grupo.evento;

            return (
              <TouchableOpacity
                key={ev?.id}
                style={s.eventListCard}
                onPress={() => setEventoSelecionadoId(ev?.id)}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={s.eventListTitle}>
                    {ev?.titulo || "Evento sem título"}
                  </Text>
                </View>
                <CustomIcon name="chevron-forward" size={20} color="#173EA5" />
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={s.emptyText}>
            Nenhum evento possui inscrições no momento.
          </Text>
        )}
      </ScrollView>

      <ModalFormularioInscricao
        visible={modalVisivel}
        onClose={fecharModalInscricao}
        evento={inscricaoEditando?.evento || eventoAtual || null}
        inscricaoInicial={inscricaoEditando}
        onSalvar={salvarInscricao}
        salvando={salvando}
      />

      <ToastPopup
        visible={toast.visible}
        titulo={toast.titulo}
        mensagem={toast.mensagem}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <ConfirmPopup
        visible={confirmacao.visible}
        titulo={confirmacao.titulo}
        mensagem={confirmacao.mensagem}
        tipo={confirmacao.tipo}
        onConfirm={confirmacao.onConfirm}
        onCancel={() =>
          setConfirmacao((prev) => ({ ...prev, visible: false }))
        }
      />
    </View>
  );
}