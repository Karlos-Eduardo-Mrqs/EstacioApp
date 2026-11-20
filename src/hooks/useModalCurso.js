import { useState, useEffect, useCallback } from "react";
import { buscarPublicacoesEAvisosDoCurso } from "../services/publicacaoServices";
import { buscarCoordenadoresDoCursoNoBanco } from "../services/cursoServices";

export function useModalCurso(curso) {
  const [publicacoes, setPublicacoes] = useState([]);
  const [avisosCurso, setAvisosCurso] = useState([]);
  const [coordenadoresCurso, setCoordenadoresCurso] = useState([]);
  const [carregandoPublicacoes, setCarregandoPublicacoes] = useState(false);
  const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [avisoSelecionado, setAvisoSelecionado] = useState(null);

  const carregarDadosDoCurso = useCallback(async (cursoAtual) => {
    if (!cursoAtual?.id) {
      setPublicacoes([]);
      setAvisosCurso([]);
      setCoordenadoresCurso([]);
      return;
    }

    try {
      setCarregandoPublicacoes(true);
      const [{ posts, avisos, coordenador }, coordsVinculados] = await Promise.all([
        buscarPublicacoesEAvisosDoCurso(cursoAtual.id),
        buscarCoordenadoresDoCursoNoBanco(cursoAtual.id, cursoAtual.coordenadores?.[0] || null),
      ]);

      setPublicacoes(posts || []);
      setAvisosCurso(avisos || []);

      const fallbackCoords = [
        ...(coordsVinculados || []),
        ...(coordenador ? [coordenador] : []),
        ...(Array.isArray(cursoAtual.coordenadores) ? cursoAtual.coordenadores : []),
      ];

      const unicos = [];
      const chaves = new Set();
      for (const item of fallbackCoords) {
        if (!item) continue;
        const k = item.id != null ? `id:${item.id}` : `email:${item.email || item.nome}`;
        if (!k || chaves.has(k)) continue;
        chaves.add(k);
        unicos.push(item);
      }

      setCoordenadoresCurso(unicos);
    } catch (err) {
      console.error("Erro ao carregar dados do curso:", err);
      setPublicacoes([]);
      setAvisosCurso([]);
      setCoordenadoresCurso(Array.isArray(cursoAtual.coordenadores) ? cursoAtual.coordenadores : []);
    } finally {
      setCarregandoPublicacoes(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosDoCurso(curso);
  }, [curso, carregarDadosDoCurso]);

  const alternarDescricao = useCallback((id) => {
    setPublicacoesExpandidas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const precisaExpandir = useCallback((texto) => {
    return Boolean(texto && texto.length > 120);
  }, []);

  return {
    publicacoes,
    avisosCurso,
    coordenadoresCurso,
    carregandoPublicacoes,
    publicacoesExpandidas,
    imagemSelecionada,
    setImagemSelecionada,
    avisoSelecionado,
    setAvisoSelecionado,
    alternarDescricao,
    precisaExpandir,
  };
}