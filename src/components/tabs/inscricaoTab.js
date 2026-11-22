import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  alterarStatusInscricaoNoBanco,
  atualizarInscricaoNoBanco,
  atualizarStatusInscricaoLocal,
  recuperarInscricaoPorCodigo,
  salvarInscricaoLocal,
  sincronizarInscricoesLocaisComBanco,
} from "../../services/inscricoesServices";
import { inscrTabStyles as s } from "../../styles/tabs/inscricaoTabStyles";
import { formatarDataApenas } from "../../utils/dataUtils";
import ConfirmPopup from "../ConfirmPopup";
import CustomIcon from "../CustomIcon";
import FeedbackBox from "../FeedPopup";
import ModalFormularioInscricao from "../modalInscricao";

export default function InscricaoTab({ aoAtualizarBadge }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [documentoRecuperacao, setDocumentoRecuperacao] = useState("");
  const [codigoRecuperacao, setCodigoRecuperacao] = useState("");
  const [recuperando, setRecuperando] = useState(false);

  const [feedback, setFeedback] = useState({ tipo: "", mensagem: "" });

  const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState(false);
  const [inscricaoEditando, setInscricaoEditando] = useState(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const [confirmacao, setConfirmacao] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
    onConfirm: null,
  });

  const atualizarBadge = useCallback(
    (lista) => {
      if (typeof aoAtualizarBadge === "function") {
        const ativas = (lista || []).filter((i) => i?.status !== false).length;
        aoAtualizarBadge(ativas);
      }
    },
    [aoAtualizarBadge]
  );

  const carregarMinhasInscricoes = useCallback(async () => {
    try {
      setCarregando(true);
      setFeedback({ tipo: "", mensagem: "" });

      const sincronizadas = await sincronizarInscricoesLocaisComBanco();
      const listaFinal = Array.isArray(sincronizadas) ? sincronizadas : [];

      setInscricoes(listaFinal);
      atualizarBadge(listaFinal);
    } catch (error) {
      console.error("Erro ao sincronizar inscrições:", error);
      setFeedback({
        tipo: "erro",
        mensagem: "Não foi possível sincronizar suas inscrições agora.",
      });
    } finally {
      setCarregando(false);
    }
  }, [atualizarBadge]);

  useEffect(() => {
    carregarMinhasInscricoes();
  }, [carregarMinhasInscricoes]);

  const handleRecuperarInscricao = async () => {
    try {
      setRecuperando(true);
      setFeedback({ tipo: "", mensagem: "" });

      const recuperada = await recuperarInscricaoPorCodigo({
        documento: documentoRecuperacao,
        codigoAcesso: codigoRecuperacao,
      });

      const listaAtualizada = await sincronizarInscricoesLocaisComBanco();
      const final = listaAtualizada.length > 0 ? listaAtualizada : [recuperada];

      setInscricoes(final);
      atualizarBadge(final);
      setDocumentoRecuperacao("");
      setCodigoRecuperacao("");
      setFeedback({
        tipo: "sucesso",
        mensagem: `Inscrição em "${recuperada?.evento?.titulo || "evento"}" recuperada e salva neste dispositivo!`,
      });
    } catch (error) {
      setFeedback({
        tipo: "erro",
        mensagem: error?.message || "Não foi possível recuperar a inscrição.",
      });
    } finally {
      setRecuperando(false);
    }
  };

  const handleEditar = (inscricao) => {
    setInscricaoEditando(inscricao);
    setModalEdicaoVisivel(true);
  };

  const handleSalvarEdicao = async (dadosForm) => {
    if (!inscricaoEditando?.id) return;
    try {
      setSalvandoEdicao(true);
      const atualizada = await atualizarInscricaoNoBanco(inscricaoEditando.id, {
        nome_completo: dadosForm.nomeCompleto,
        eh_aluno: dadosForm.ehAluno,
        matricula: dadosForm.matricula,
        cpf: dadosForm.cpf,
        telefone: dadosForm.telefone,
        email: dadosForm.email,
      });

      const registroFinal = { ...inscricaoEditando, ...(atualizada || {}) };
      await salvarInscricaoLocal(registroFinal);

      setInscricoes((prev) => {
        const novaLista = prev.map((item) =>
          item.id === inscricaoEditando.id ? registroFinal : item
        );
        atualizarBadge(novaLista);
        return novaLista;
      });

      setModalEdicaoVisivel(false);
      setFeedback({
        tipo: "sucesso",
        mensagem: "Dados da inscrição atualizados com sucesso!",
      });
    } catch (error) {
      setFeedback({
        tipo: "erro",
        mensagem: error?.message || "Erro ao atualizar inscrição.",
      });
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const solicitarCancelamento = (inscricao) => {
    setConfirmacao({
      visible: true,
      titulo: "Cancelar inscrição",
      mensagem: `Deseja realmente cancelar sua inscrição em "${
        inscricao?.evento?.titulo || "este evento"
      }"?`,
      onConfirm: async () => {
        setConfirmacao((prev) => ({ ...prev, visible: false }));
        try {
          await alterarStatusInscricaoNoBanco(inscricao.id, false);
          await atualizarStatusInscricaoLocal(inscricao.id, false);

          setInscricoes((prev) => {
            const novaLista = prev.map((item) =>
              item.id === inscricao.id ? { ...item, status: false } : item
            );
            atualizarBadge(novaLista);
            return novaLista;
          });

          setFeedback({
            tipo: "sucesso",
            mensagem: "Inscrição cancelada com sucesso.",
          });
        } catch (error) {
          setFeedback({
            tipo: "erro",
            mensagem: "Não foi possível cancelar a inscrição.",
          });
        }
      },
    });
  };

  return (
    <View style={s.container}>
      <Text style={s.headerTitle}>Minhas Inscrições</Text>
      <Text style={s.headerSubtitle}>
        Acompanhe o status atualizado das suas inscrições ou recupere-as em
        outro dispositivo.
      </Text>

      <FeedbackBox
        tipo={feedback.tipo}
        mensagem={feedback.mensagem}
        onClose={() => setFeedback({ tipo: "", mensagem: "" })}
      />

      <View style={s.recoveryCard}>
        <Text style={s.recoveryTitle}>
          Recuperar inscrição em outro aparelho ou após limpar dados
        </Text>

        <View style={s.recoveryRow}>
          <TextInput
            style={s.recoveryInput}
            value={documentoRecuperacao}
            onChangeText={setDocumentoRecuperacao}
            placeholder="Matrícula ou CPF"
            placeholderTextColor="#94A3B8"
          />

          <TextInput
            style={s.codeInput}
            value={codigoRecuperacao}
            onChangeText={(t) => setCodigoRecuperacao(t.toUpperCase())}
            placeholder="Código (ex.: 8F3K2A9B)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={12}
          />

          <TouchableOpacity
            style={s.recoveryButton}
            onPress={handleRecuperarInscricao}
            disabled={recuperando}
            activeOpacity={0.85}
          >
            <CustomIcon name="key-outline" size={16} color="#FFFFFF" />
            <Text style={s.recoveryButtonText}>
              {recuperando ? "Buscando..." : "Recuperar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#173EA5" style={s.loader} />
      ) : inscricoes.length === 0 ? (
        <View style={s.emptyCard}>
          <CustomIcon name="calendar-outline" size={32} color="#94A3B8" />
          <Text style={s.emptyText}>
            Nenhuma inscrição salva neste dispositivo.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {inscricoes.map((item) => {
            const ativa = item?.status !== false;
            const dataEvento = item?.evento?.data_inicio
              ? formatarDataApenas(item.evento.data_inicio)
              : "";

            return (
              <View
                key={item.id}
                style={[
                  s.inscriptionCard,
                  ativa ? s.cardActiveBorder : s.cardCanceledBorder,
                ]}
              >
                <View style={s.cardTopRow}>
                  <View
                    style={[
                      s.statusBadge,
                      ativa ? s.statusBadgeActive : s.statusBadgeCanceled,
                    ]}
                  >
                    <Text
                      style={
                        ativa ? s.statusTextActive : s.statusTextCanceled
                      }
                    >
                      {ativa ? "🟢 Inscrição Ativa" : "🔴 Cancelada"}
                    </Text>
                  </View>

                  {dataEvento ? (
                    <Text style={s.dateText}>📅 {dataEvento}</Text>
                  ) : null}
                </View>

                <Text style={s.eventTitle}>
                  {item?.evento?.titulo || `Evento #${item?.evento_id}`}
                </Text>

                <View style={s.infoBox}>
                  <View style={s.infoRow}>
                    <CustomIcon
                      name="person-outline"
                      size={14}
                      color="#475569"
                    />
                    <Text style={s.participantText}>
                      {item?.nome_completo}
                    </Text>
                  </View>

                  <View style={s.infoRow}>
                    <CustomIcon
                      name={item?.eh_aluno ? "school-outline" : "card-outline"}
                      size={14}
                      color="#64748B"
                    />
                    <Text style={s.documentText}>
                      {item?.eh_aluno
                        ? `Matrícula: ${item?.matricula}`
                        : `CPF: ${item?.cpf}`}
                    </Text>
                  </View>
                </View>

                {item?.codigo_acesso ? (
                  <View style={s.codePill}>
                    <CustomIcon name="key-outline" size={14} color="#173EA5" />
                    <Text style={s.codeText}>
                      Código: {item.codigo_acesso}
                    </Text>
                  </View>
                ) : null}

                {ativa && (
                  <View style={s.actionsRow}>
                    <TouchableOpacity
                      style={s.editButton}
                      onPress={() => handleEditar(item)}
                      activeOpacity={0.8}
                    >
                      <CustomIcon
                        name="pencil-outline"
                        size={15}
                        color="#173EA5"
                      />
                      <Text style={s.editButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={s.cancelButton}
                      onPress={() => solicitarCancelamento(item)}
                      activeOpacity={0.8}
                    >
                      <CustomIcon
                        name="close-circle-outline"
                        size={15}
                        color="#DC2626"
                      />
                      <Text style={s.cancelButtonText}>
                        Cancelar inscrição
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          <Text style={s.footerNote}>
            As suas inscrições ficam salvas neste dispositivo e sincronizadas
            com o sistema. Guarde o código para recuperar noutro aparelho.
          </Text>
        </ScrollView>
      )}

      <ModalFormularioInscricao
        visible={modalEdicaoVisivel}
        onClose={() => setModalEdicaoVisivel(false)}
        evento={
          inscricaoEditando?.evento || {
            id: inscricaoEditando?.evento_id,
            titulo: "Evento",
          }
        }
        inscricaoInicial={inscricaoEditando}
        onSalvar={handleSalvarEdicao}
        salvando={salvandoEdicao}
      />

      <ConfirmPopup
        visible={confirmacao.visible}
        titulo={confirmacao.titulo}
        mensagem={confirmacao.mensagem}
        tipo="danger"
        onConfirm={confirmacao.onConfirm}
        onCancel={() =>
          setConfirmacao((prev) => ({ ...prev, visible: false }))
        }
      />
    </View>
  );
}