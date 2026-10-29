import { useState, useMemo } from 'react';

export function useBuscaEventos(eventosIniciais = []) {
  const [pesquisa, setPesquisa] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [eventoModal, setEventoModal] = useState(null);

  // Lógica pesada de filtragem isolada do componente visual
  const eventosFiltrados = useMemo(() => {
    return eventosIniciais.filter(evento => {
      const matchTexto = evento.titulo?.toLowerCase().includes(pesquisa.toLowerCase()) || evento.descricao?.toLowerCase().includes(pesquisa.toLowerCase());
      
      const matchCurso = cursoSelecionado ? evento.curso === cursoSelecionado : true;

      return matchTexto && matchCurso;
    });
  }, [eventosIniciais, pesquisa, cursoSelecionado]);

  return {
    pesquisa,
    setPesquisa,
    cursoSelecionado,
    setCursoSelecionado,
    eventoModal,
    setEventoModal,
    eventosFiltrados,
  };
}