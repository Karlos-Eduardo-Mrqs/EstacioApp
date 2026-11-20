import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';

const TAMANHO_LOTE = 21;

export function useBuscaEventos(eventosIniciais = []) {
  const [pesquisa, setPesquisa] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [eventoModal, setEventoModal] = useState(null);
  const [imagemPadraoUrl, setImagemPadraoUrl] = useState(null);

  const [limiteExibicao, setLimiteExibicao] = useState(TAMANHO_LOTE);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const timeoutCarregarRef = useRef(null);

  useEffect(() => {
    async function buscarImagemPadrao() {
      try {
        const { data, error } = await supabase
          .from('imagem')
          .select('caminho_img')
          .eq('id', 21)
          .single();

        if (!error && data?.caminho_img) {
          setImagemPadraoUrl(data.caminho_img);
        }
      } catch (err) {
        console.warn("Não foi possível carregar a imagem padrão ID 21", err);
      }
    }
    buscarImagemPadrao();

    return () => {
      if (timeoutCarregarRef.current) {
        clearTimeout(timeoutCarregarRef.current);
      }
    };
  }, []);

  const eventosComImagemTratada = useMemo(() => {
    return eventosIniciais.map((evento) => {
      const temImagemValida =
        typeof evento?.imagem === 'object' ? evento.imagem?.caminho_img : evento?.imagem;

      if (!temImagemValida && imagemPadraoUrl) {
        return {
          ...evento,
          imagem: imagemPadraoUrl,
        };
      }
      return evento;
    });
  }, [eventosIniciais, imagemPadraoUrl]);

  const eventosFiltrados = useMemo(() => {
    return eventosComImagemTratada.filter((evento) => {
      const termo = pesquisa.trim().toLowerCase();

      let nomeCurso = "";
      if (evento?.curso) {
        nomeCurso = typeof evento.curso === 'object' ? (evento.curso.nome || "") : evento.curso;
      } else if (evento?.turma) {
        nomeCurso = typeof evento.turma === 'object' ? (evento.turma.nome || "") : evento.turma;
      }

      const matchTexto =
        !termo ||
        evento.titulo?.toLowerCase().includes(termo) ||
        evento.descricao?.toLowerCase().includes(termo) ||
        nomeCurso.toLowerCase().includes(termo);

      const matchCurso = cursoSelecionado ? nomeCurso === cursoSelecionado : true;

      return matchTexto && matchCurso;
    });
  }, [eventosComImagemTratada, pesquisa, cursoSelecionado]);

  // Volta para 21 itens sempre que o filtro ou a busca muda
  useEffect(() => {
    setLimiteExibicao(TAMANHO_LOTE);
    setCarregandoMais(false);
    if (timeoutCarregarRef.current) {
      clearTimeout(timeoutCarregarRef.current);
    }
  }, [pesquisa, cursoSelecionado]);

  const eventosVisiveis = useMemo(() => {
    return eventosFiltrados.slice(0, limiteExibicao);
  }, [eventosFiltrados, limiteExibicao]);

  const temMaisEventos = eventosVisiveis.length < eventosFiltrados.length;

  const carregarMaisEventos = useCallback(() => {
    if (!temMaisEventos || carregandoMais) return;

    setCarregandoMais(true);
    timeoutCarregarRef.current = setTimeout(() => {
      setLimiteExibicao((prev) => Math.min(prev + TAMANHO_LOTE, eventosFiltrados.length));
      setCarregandoMais(false);
    }, 350);
  }, [temMaisEventos, carregandoMais, eventosFiltrados.length]);

  return {
    pesquisa,
    setPesquisa,
    cursoSelecionado,
    setCursoSelecionado,
    eventoModal,
    setEventoModal,
    eventosFiltrados: eventosVisiveis,
    totalFiltrados: eventosFiltrados.length,
    temMaisEventos,
    carregandoMais,
    carregarMaisEventos,
    imagemPadraoUrl,
  };
}