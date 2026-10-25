import { useState, useEffect } from 'react';
import { buscarCursosDoBanco, buscarEventosDoBanco } from '../services/apiServices';

export function useDadosAcademicos(exibirPopup) {
  const [todosOsEventos, setTodosOsEventos] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState(null);

  const [cursosDoBanco, setCursosDoBanco] = useState([]);
  const [carregandoCursos, setCarregandoCursos] = useState(true);
  const [erroCursos, setErroCursos] = useState(null);

  // Carregar Cursos
  useEffect(() => {
    let ativo = true;
    async function carregarCursos() {
      setCarregandoCursos(true);
      try {
        const cursos = await buscarCursosDoBanco();
        if (ativo) setCursosDoBanco(cursos);
      } catch (error) {
        if (ativo) {
          const msg = error instanceof Error ? error.message : 'Não foi possível carregar os cursos.';
          setErroCursos(msg);
          exibirPopup("❌ Erro nos Cursos", msg, "erro", 4);
        }
      } finally {
        if (ativo) setCarregandoCursos(false);
      }
    }
    carregarCursos();
    return () => { ativo = false; };
  }, []);

  // Carregar Eventos
  useEffect(() => {
    let ativo = true;
    async function carregarEventos() {
      setCarregandoEventos(true);
      try {
        const eventos = await buscarEventosDoBanco();
        if (ativo) setTodosOsEventos(eventos);
      } catch (error) {
        if (ativo) {
          setTodosOsEventos([]);
          const msg = error instanceof Error ? error.message : 'Erro ao carregar eventos.';
          setErroEventos(msg);
          exibirPopup("❌ Erro nos Eventos", msg, "erro", 4);
        }
      } finally {
        if (ativo) setCarregandoEventos(false);
      }
    }
    carregarEventos();
    return () => { ativo = false; };
  }, []);

  return {
    todosOsEventos,
    carregandoEventos,
    erroEventos,
    cursosDoBanco,
    carregandoCursos,
    erroCursos,
  };
}