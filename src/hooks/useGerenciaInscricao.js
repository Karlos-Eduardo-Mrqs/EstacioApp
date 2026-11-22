import { useEffect, useMemo, useState } from "react";
import {
  agruparEventosComEstatisticas,
  alterarStatusInscricaoNoBanco,
  atualizarInscricaoNoBanco,
  buscarInscricoesComEventos,
  criarInscricaoNoBanco,
  exportarInscricoesParaExcel,
} from "../services/inscricoesServices";

export function useGerenciarInscricoes(usuarioAtual = null) {
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [inscricaoEditando, setInscricaoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
  });

  const [confirmacao, setConfirmacao] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
    tipo: "danger",
    onConfirm: null,
  });

  async function carregarInscricoes() {
    try {
      setCarregando(true);
      const dados = await buscarInscricoesComEventos(usuarioAtual);
      setInscricoes(dados || []);
    } catch (error) {
      console.log("Erro ao carregar inscrições:", error);
      setToast({
        visible: true,
        titulo: "Erro",
        mensagem: "Não foi possível carregar as inscrições.",
      });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarInscricoes();
  }, [usuarioAtual]);

  const eventosComInscricoes = useMemo(() => {
    const agrupados = agruparEventosComEstatisticas(inscricoes);
    if (!busca.trim()) return agrupados;

    const termo = busca.toLowerCase();
    return agrupados.filter((item) =>
      item.evento?.titulo?.toLowerCase().includes(termo)
    );
  }, [inscricoes, busca]);

  const grupoSelecionado = useMemo(
    () =>
      eventosComInscricoes.find(
        (item) => String(item.evento?.id) === String(eventoSelecionadoId)
      ) || null,
    [eventosComInscricoes, eventoSelecionadoId]
  );

  const abrirNovaInscricao = () => {
    setInscricaoEditando(null);
    setModalVisivel(true);
  };

  const abrirEdicaoInscricao = (inscricao) => {
    setInscricaoEditando(inscricao);
    setModalVisivel(true);
  };

  const fecharModalInscricao = () => {
    setModalVisivel(false);
    setInscricaoEditando(null);
  };

  async function salvarInscricao(dadosForm) {
    try {
      setSalvando(true);

      if (inscricaoEditando) {
        await atualizarInscricaoNoBanco(inscricaoEditando.id, {
          nome_completo: dadosForm.nomeCompleto,
          eh_aluno: dadosForm.ehAluno,
          matricula: dadosForm.matricula,
          cpf: dadosForm.cpf,
          telefone: dadosForm.telefone,
          email: dadosForm.email,
          status: dadosForm.status,
        });

        setToast({
          visible: true,
          titulo: "Sucesso",
          mensagem: "Inscrição atualizada com sucesso!",
        });
      } else {
        await criarInscricaoNoBanco({
          eventoId: dadosForm.eventoId,
          usuarioId: usuarioAtual?.id || null,
          nomeCompleto: dadosForm.nomeCompleto,
          ehAluno: dadosForm.ehAluno,
          matricula: dadosForm.matricula,
          cpf: dadosForm.cpf,
          telefone: dadosForm.telefone,
          email: dadosForm.email,
        });

        setToast({
          visible: true,
          titulo: "Inscrição confirmada",
          mensagem: "A inscrição foi registrada com sucesso!",
        });
      }

      fecharModalInscricao();
      await carregarInscricoes();
    } finally {
      setSalvando(false);
    }
  }

  function alternarStatusInscricao(inscricao) {
    const novoStatus = !(inscricao.status !== false);
    setConfirmacao({
      visible: true,
      titulo: novoStatus ? "Reativar inscrição" : "Cancelar inscrição",
      mensagem: `Deseja marcar a inscrição de "${inscricao.nome_completo}" como ${
        novoStatus ? "ativa" : "cancelada"
      }?`,
      tipo: "info",
      onConfirm: async () => {
        setConfirmacao((prev) => ({ ...prev, visible: false }));
        try {
          await alterarStatusInscricaoNoBanco(inscricao.id, novoStatus);
          await carregarInscricoes();
          setToast({
            visible: true,
            titulo: "Status atualizado",
            mensagem: `Inscrição agora está ${novoStatus ? "ativa" : "cancelada"}.`,
          });
        } catch (error) {
          setToast({
            visible: true,
            titulo: "Erro",
            mensagem: "Não foi possível alterar o status da inscrição.",
          });
        }
      },
    });
  }

  async function exportarExcel(eventoOuGrupo = grupoSelecionado, listaOpcional = null) {
  let evento = null;
  let lista = [];

  if (Array.isArray(listaOpcional)) {
    evento = eventoOuGrupo;
    lista = listaOpcional;
  } else if (eventoOuGrupo?.evento && Array.isArray(eventoOuGrupo?.inscricoes)) {
    evento = eventoOuGrupo.evento;
    lista = eventoOuGrupo.inscricoes;
  } else if (grupoSelecionado) {
    evento = grupoSelecionado.evento;
    lista = grupoSelecionado.inscricoes || [];
  }

  if (!evento) return;

  try {
    const arquivo = await exportarInscricoesParaExcel(evento, lista);
    setToast({
      visible: true,
      titulo: "Excel exportado",
      mensagem: `Planilha "${arquivo}" gerada com sucesso!`,
    });
  } catch (error) {
    console.log("Erro ao exportar Excel:", error);
    setToast({
      visible: true,
      titulo: "Erro ao exportar",
      mensagem: error?.message || "Não foi possível gerar o arquivo Excel.",
    });
  }
}
  

  async function excluirInscricao(inscricao) {
    setConfirmacao({
      visible: true,
      titulo: "Excluir inscrição",
      mensagem: `Deseja excluir permanentemente a inscrição de "${inscricao.nome_completo}"?`,
      tipo: "danger",
      onConfirm: async () => {
        setConfirmacao((prev) => ({ ...prev, visible: false }));
        try {
          const { error } = await supabase
            .from("inscricao")
            .delete()
            .eq("id", inscricao.id);
          if (error) throw error;
          await carregarInscricoes();
          setToast({
            visible: true,
            titulo: "Inscrição excluída",
            mensagem: "A inscrição foi removida do banco de dados.",
          });
        } catch (error) {
          setToast({
            visible: true,
            titulo: "Erro",
            mensagem: "Não foi possível excluir a inscrição.",
          });
        }
      },
    });
  }

  return {
    inscricoes,
    eventosComInscricoes,
    grupoSelecionado,
    eventoSelecionadoId,
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
    carregarInscricoes,
    abrirNovaInscricao,
    abrirEdicaoInscricao,
    fecharModalInscricao,
    salvarInscricao,
    alternarStatusInscricao,
    exportarExcel,
    excluirInscricao
  };
}