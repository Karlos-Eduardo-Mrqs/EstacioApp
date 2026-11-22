import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Linking, useWindowDimensions } from "react-native";
import { supabase } from "../../lib/supabase";
import { compartilharCard } from "../services/compartilharServices";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";
import {
  carregarFallbackImagemEvento,
  obterUrlImagemEvento,
} from "../services/imagemServices";
import {
  criarInscricaoNoBanco,
  salvarInscricaoLocal,
} from "../services/inscricoesServices";
import { formatarDataApenas } from "../utils/dataUtils";

export function useEventoDetalhe({
  evento,
  onClose,
  onNotificar,
  imagemPadraoUrl,
  usuarioAtual = null,
}) {
  const viewRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const isCompact = width < 480 || height < 720;
  const isVeryNarrow = width < 380;

  const [feedback, setFeedback] = useState({ tipo: "", mensagem: "" });
  const [fallbackUrl, setFallbackUrl] = useState(imagemPadraoUrl || null);
  const [imagemTelaCheiaVisivel, setImagemTelaCheiaVisivel] = useState(false);

  const [modalInscricaoVisivel, setModalInscricaoVisivel] = useState(false);
  const [salvandoInscricao, setSalvandoInscricao] = useState(false);

  const [vagasOcupadas, setVagasOcupadas] = useState(0);
  const [carregandoVagas, setCarregandoVagas] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    titulo: "",
    mensagem: "",
    onConfirm: () => {},
    tipo: "info",
  });

  useEffect(() => {
    let ativo = true;

    if (imagemPadraoUrl) {
      setFallbackUrl(imagemPadraoUrl);
      return () => {
        ativo = false;
      };
    }

    carregarFallbackImagemEvento(21).then((url) => {
      if (ativo && url) {
        setFallbackUrl(url);
      }
    });

    return () => {
      ativo = false;
    };
  }, [imagemPadraoUrl]);

  const carregarContagemVagas = useCallback(async () => {
    if (!evento?.id) return;
    try {
      setCarregandoVagas(true);
      const { count, error } = await supabase
        .from("inscricao")
        .select("id", { count: "exact", head: true })
        .eq("evento_id", evento.id)
        .neq("status", false);

      if (error) throw error;
      setVagasOcupadas(Number(count || 0));
    } catch (error) {
      console.warn("Erro ao consultar ocupação de vagas:", error);
    } finally {
      setCarregandoVagas(false);
    }
  }, [evento?.id]);

  useEffect(() => {
    if (evento?.id) {
      carregarContagemVagas();
    } else {
      setVagasOcupadas(0);
    }
  }, [evento?.id, carregarContagemVagas]);

  const inscricaoHabilitada = Boolean(
    evento?.possui_inscricao ??
      evento?.permite_inscricao ??
      evento?.possui_eventos
  );

  const linkEvento = evento?.link_transmissao || evento?.link || null;

  const estatisticasVagas = useMemo(() => {
    const limiteRaw = Number(evento?.limite_vagas);
    const temLimite = Number.isFinite(limiteRaw) && limiteRaw > 0;

    if (!temLimite) {
      return {
        temLimite: false,
        limiteVagas: null,
        vagasOcupadas,
        vagasRestantes: null,
        porcentagemOcupada: 0,
        lotado: false,
      };
    }

    const vagasRestantes = Math.max(limiteRaw - vagasOcupadas, 0);
    const porcentagemOcupada = Math.min(
      100,
      Math.max(0, Math.round((vagasOcupadas / limiteRaw) * 100))
    );

    return {
      temLimite: true,
      limiteVagas: limiteRaw,
      vagasOcupadas,
      vagasRestantes,
      porcentagemOcupada,
      lotado: vagasRestantes === 0,
    };
  }, [evento?.limite_vagas, vagasOcupadas]);

  const handleAcessarLink = useCallback(async () => {
    if (!linkEvento) return;
    try {
      const supported = await Linking.canOpenURL(linkEvento);
      if (supported) {
        await Linking.openURL(linkEvento);
      } else {
        setFeedback({
          tipo: "erro",
          mensagem: "Não foi possível abrir este link.",
        });
      }
    } catch (error) {
      setFeedback({ tipo: "erro", mensagem: "Erro ao tentar abrir o link." });
    }
  }, [linkEvento]);

  const handleConfirmarInscricao = useCallback(
    async (dadosForm) => {
      if (!evento?.id) return;
      try {
        setSalvandoInscricao(true);
        setFeedback({ tipo: "", mensagem: "" });

        const criada = await criarInscricaoNoBanco({
          eventoId: evento.id,
          usuarioId: usuarioAtual?.id || null,
          nomeCompleto: dadosForm.nomeCompleto,
          ehAluno: dadosForm.ehAluno,
          matricula: dadosForm.matricula,
          cpf: dadosForm.cpf,
          telefone: dadosForm.telefone,
          email: dadosForm.email,
        });

        await salvarInscricaoLocal({ ...criada, evento });
        await carregarContagemVagas();

        setModalInscricaoVisivel(false);
        setFeedback({
          tipo: "sucesso",
          mensagem: "Inscrição confirmada com sucesso!",
        });
      } catch (error) {
        const msgErro =
          error?.message || "Não foi possível concluir a inscrição.";
        setFeedback({
          tipo: "erro",
          mensagem: msgErro,
        });
        throw error;
      } finally {
        setSalvandoInscricao(false);
      }
    },
    [evento, usuarioAtual?.id, carregarContagemVagas]
  );

  const handleCompartilharClick = useCallback(() => {
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
  }, [evento]);

  const handleNotificarClick = useCallback(() => {
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
            onClose?.();
          }, 1200);
        }
      },
    });
    setConfirmVisible(true);
  }, [evento, onNotificar, onClose]);

  const urlFinal = obterUrlImagemEvento(evento, fallbackUrl);
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

  const inicioFmt = formatarDataApenas(
    evento?.data_inicio ||
      evento?.inicio ||
      evento?.dia ||
      evento?.data ||
      evento?.dataEvento
  );
  const fimFmt = evento?.data_fim ? formatarDataApenas(evento.data_fim) : "";

  const dataFormatada =
    inicioFmt && fimFmt && fimFmt !== inicioFmt
      ? `${inicioFmt} até ${fimFmt}`
      : inicioFmt;

  const horasAAC = evento?.horasAAC || evento?.horas_acc;

  return {
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
  };
}