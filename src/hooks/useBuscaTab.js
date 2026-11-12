import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase'; // 👈 Ajuste o caminho do seu client supabase se necessário

export function useBuscaEventos(eventosIniciais = []) {
  const [pesquisa, setPesquisa] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [eventoModal, setEventoModal] = useState(null);
  const [imagemPadraoUrl, setImagemPadraoUrl] = useState(null);

  // 🔍 1. Busca a imagem padrão (id = 21) do Supabase uma única vez ao iniciar
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
  }, []);

  // 🛡️ 2. Injeta a imagem padrão (id = 21) nos itens que não possuem imagem
  const eventosComImagemTratada = useMemo(() => {
    return eventosIniciais.map(evento => {
      const temImagemValida = typeof evento?.imagem === 'object' ? evento.imagem?.caminho_img : evento?.imagem;
      
      if (!temImagemValida && imagemPadraoUrl) {
        return {
          ...evento,
          imagem: imagemPadraoUrl
        };
      }
      return evento;
    });
  }, [eventosIniciais, imagemPadraoUrl]);

  // 🔍 3. Lógica de filtragem aprimorada (pesquisa por título, descrição E nome do curso)
  const eventosFiltrados = useMemo(() => {
    return eventosComImagemTratada.filter(evento => {
      const termo = pesquisa.toLowerCase();

      // Extrai o nome do curso de forma segura (seja string ou objeto relacional do Supabase)
      let nomeCurso = "";
      if (evento?.curso) {
        nomeCurso = typeof evento.curso === 'object' ? (evento.curso.nome || "") : evento.curso;
      } else if (evento?.turma) {
        nomeCurso = typeof evento.turma === 'object' ? (evento.turma.nome || "") : evento.turma;
      }

      const matchTexto = 
        evento.titulo?.toLowerCase().includes(termo) || 
        evento.descricao?.toLowerCase().includes(termo) ||
        nomeCurso.toLowerCase().includes(termo); // 👈 Agora pesquisa também pelo nome do curso/turma!
      
      const matchCurso = cursoSelecionado ? nomeCurso === cursoSelecionado : true;

      return matchTexto && matchCurso;
    });
  }, [eventosComImagemTratada, pesquisa, cursoSelecionado]);

  return {
    pesquisa,
    setPesquisa,
    cursoSelecionado,
    setCursoSelecionado,
    eventoModal,
    setEventoModal,
    eventosFiltrados,
    imagemPadraoUrl
  };
}