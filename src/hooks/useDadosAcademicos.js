import { useState, useEffect, useCallback } from 'react';
import { buscarCursosDoBanco, buscarEventosDoBanco, buscarServicosDoBanco } from '../services/apiServices';
import { formatarDataApenas, formatarDataHora, obterTempoEvento } from '../utils/dataUtils';

function parseDataSegura(valor) {
  if (!valor) return null;
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;

  if (typeof valor === 'string') {
    // Trata datas YYYY-MM-DD no fuso local para não deslocar um dia
    const matchISOData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim());
    if (matchISOData) {
      const [, ano, mes, dia] = matchISOData;
      const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
      return Number.isNaN(d.getTime()) ? null : d;
    }

    // Trata datas DD/MM/YYYY vindas de formatarDataApenas
    const matchBR = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor.trim());
    if (matchBR) {
      const [, dia, mes, ano] = matchBR;
      const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
      return Number.isNaN(d.getTime()) ? null : d;
    }
  }

  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function useDadosAcademicos(exibirPopup, notificarErro = true) {
  const [todosOsEventos, setTodosOsEventos] = useState([]);
  const [servicosInstitucionais, setServicosInstitucionais] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState(null);

  const [cursosDoBanco, setCursosDoBanco] = useState([]);
  const [carregandoCursos, setCarregandoCursos] = useState(true);
  const [erroCursos, setErroCursos] = useState(null);

  const carregarDadosAcademicos = useCallback(async () => {
    setCarregandoCursos(true);
    setCarregandoEventos(true);

    const [resCursos, resEventos, resServicos] = await Promise.allSettled([
      buscarCursosDoBanco(),
      buscarEventosDoBanco(),
      buscarServicosDoBanco(),
    ]);

    if (resCursos.status === 'fulfilled') {
      setCursosDoBanco(resCursos.value || []);
      setErroCursos(null);
    } else {
      const msg = resCursos.reason instanceof Error
        ? resCursos.reason.message
        : 'Não foi possível carregar os cursos.';
      setErroCursos(msg);
      if (notificarErro && exibirPopup) {
        exibirPopup("❌ Erro nos Cursos", msg, "erro", 4);
      }
    }
    setCarregandoCursos(false);

    if (resEventos.status === 'fulfilled') {
      const agora = Date.now();
      const eventosFormatados = (resEventos.value || []).map((evento) => {
        const origemData = evento.dataEvento ?? evento.data ?? evento.inicio;
        const dataRef = parseDataSegura(origemData);
        const dataFormatada = formatarDataApenas(dataRef ?? origemData);
        const dataHoraFormatada = formatarDataHora(evento.inicio ?? origemData);
        const tempoStatus = evento.inicio && evento.termino
          ? obterTempoEvento(evento, agora)
          : null;

        return {
          ...evento,
          dataEvento: dataRef,
          dataFormatada,
          dataHoraFormatada,
          tempoStatus,
        };
      });

      setTodosOsEventos(eventosFormatados);
      setErroEventos(null);
    } else {
      setTodosOsEventos([]);
      const msg = resEventos.reason instanceof Error
        ? resEventos.reason.message
        : 'Erro ao carregar eventos.';
      setErroEventos(msg);
      if (notificarErro && exibirPopup) {
        exibirPopup("❌ Erro nos Eventos", msg, "erro", 4);
      }
    }
    setCarregandoEventos(false);

    if (resServicos.status === 'fulfilled') {
      setServicosInstitucionais(resServicos.value || []);
    } else {
      console.log("Erro ao carregar serviços no mural:", resServicos.reason);
    }
  }, [exibirPopup, notificarErro]);

  useEffect(() => {
    carregarDadosAcademicos();
  }, [carregarDadosAcademicos]);

  return {
    todosOsEventos,
    carregandoEventos,
    erroEventos,
    cursosDoBanco,
    carregandoCursos,
    erroCursos,
    servicos: servicosInstitucionais,
    recarregarDadosAcademicos: carregarDadosAcademicos,
  };
}