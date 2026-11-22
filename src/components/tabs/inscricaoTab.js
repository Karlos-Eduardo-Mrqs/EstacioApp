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
  buscarInscricoesPorIdsOuDocumento,
  obterInscricoesLocais,
  salvarInscricaoLocal,
} from "../../services/inscricoesServices";
import { formatarDataApenas } from "../../utils/dataUtils";
import ConfirmPopup from "../ConfirmPopup";
import CustomIcon from "../CustomIcon";
import FeedbackBox from "../FeedPopup";
import ModalFormularioInscricao from "../modalInscricao";

export default function InscricaoTab({ aoAtualizarBadge }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [documentoBusca, setDocumentoBusca] = useState("");
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

  const carregarMinhasInscricoes = useCallback(
    async (docManual = "") => {
      try {
        setCarregando(true);
        setFeedback({ tipo: "", mensagem: "" });

        const locais =
          typeof obterInscricoesLocais === "function"
            ? await obterInscricoesLocais()
            : [];

        const idsLocais = Array.isArray(locais)
          ? locais.map((item) => item?.id).filter(Boolean)
          : [];

        let dadosAtualizados = [];
        if (typeof buscarInscricoesPorIdsOuDocumento === "function") {
          dadosAtualizados = await buscarInscricoesPorIdsOuDocumento({
            ids: idsLocais,
            documento: docManual.trim(),
          });
        }

        const listaFinal =
          Array.isArray(dadosAtualizados) && dadosAtualizados.length > 0
            ? dadosAtualizados
            : Array.isArray(locais)
              ? locais
              : [];

        setInscricoes(listaFinal);

        if (typeof aoAtualizarBadge === "function") {
          const ativas = listaFinal.filter((i) => i?.status !== false).length;
          aoAtualizarBadge(ativas);
        }
      } catch (error) {
        console.error("Erro ao carregar inscrições do usuário:", error);
        setFeedback({
          tipo: "erro",
          mensagem: "Não foi possível carregar suas inscrições agora.",
        });
      } finally {
        setCarregando(false);
      }
    },
    [aoAtualizarBadge],
  );

  useEffect(() => {
    carregarMinhasInscricoes();
  }, [carregarMinhasInscricoes]);

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
      if (typeof salvarInscricaoLocal === "function") {
        await salvarInscricaoLocal(registroFinal);
      }

      setInscricoes((prev) =>
        prev.map((item) =>
          item.id === inscricaoEditando.id ? registroFinal : item,
        ),
      );
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
          if (typeof atualizarStatusInscricaoLocal === "function") {
            await atualizarStatusInscricaoLocal(inscricao.id, false);
          }

          setInscricoes((prev) => {
            const novaLista = prev.map((item) =>
              item.id === inscricao.id ? { ...item, status: false } : item,
            );
            if (typeof aoAtualizarBadge === "function") {
              aoAtualizarBadge(
                novaLista.filter((i) => i?.status !== false).length,
              );
            }
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
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: "#032551" }}>
        Minhas Inscrições
      </Text>
      <Text style={{ fontSize: 12.5, color: "#64748B", marginBottom: 14 }}>
        Acompanhe, edite ou cancele suas inscrições salvas neste dispositivo.
      </Text>

      <FeedbackBox
        tipo={feedback.tipo}
        mensagem={feedback.mensagem}
        onClose={() => setFeedback({ tipo: "", mensagem: "" })}
      />

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 13.5,
            color: "#0F172A",
          }}
          value={documentoBusca}
          onChangeText={setDocumentoBusca}
          placeholder="Buscar por Matrícula ou CPF..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#173EA5",
            borderRadius: 10,
            paddingHorizontal: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => carregarMinhasInscricoes(documentoBusca)}
          activeOpacity={0.85}
        >
          <CustomIcon name="search-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#173EA5"
          style={{ marginTop: 28 }}
        />
      ) : inscricoes.length === 0 ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 24,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          <CustomIcon name="calendar-outline" size={32} color="#94A3B8" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#475569",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Nenhuma inscrição encontrada neste dispositivo.
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
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  borderLeftWidth: 4,
                  borderLeftColor: ativa ? "#16A34A" : "#DC2626",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: ativa ? "#15803D" : "#DC2626",
                      backgroundColor: ativa ? "#F0FDF4" : "#FEF2F2",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                    }}
                  >
                    {ativa ? "🟢 Inscrição Ativa" : "🔴 Cancelada"}
                  </Text>

                  {dataEvento ? (
                    <Text style={{ fontSize: 12, color: "#64748B" }}>
                      📅 {dataEvento}
                    </Text>
                  ) : null}
                </View>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#0F172A",
                    marginBottom: 4,
                  }}
                >
                  {item?.evento?.titulo || `Evento #${item?.evento_id}`}
                </Text>

                <Text style={{ fontSize: 13, color: "#334155" }}>
                  👤 {item?.nome_completo}
                </Text>
                <Text
                  style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}
                >
                  {item?.eh_aluno
                    ? `🎓 Matrícula: ${item?.matricula}`
                    : `🪪 CPF: ${item?.cpf}`}
                </Text>

                {ativa && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      marginTop: 12,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: "#F1F5F9",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        backgroundColor: "#EFF6FF",
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                      onPress={() => handleEditar(item)}
                    >
                      <CustomIcon
                        name="pencil-outline"
                        size={15}
                        color="#173EA5"
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: "#173EA5",
                        }}
                      >
                        Editar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        backgroundColor: "#FEF2F2",
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                      onPress={() => solicitarCancelamento(item)}
                    >
                      <CustomIcon
                        name="close-circle-outline"
                        size={15}
                        color="#DC2626"
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: "#DC2626",
                        }}
                      >
                        Cancelar inscrição
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
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