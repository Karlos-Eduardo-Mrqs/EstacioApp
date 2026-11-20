import { supabase } from '../../lib/supabase';

// Função para buscar a lista de coordenadores disponíveis para preencher o Select
export async function buscarCoordenadoresDoBanco() {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nome, email, telefone, perfil')
    .eq('perfil', 'Coordenador')
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar coordenadores:", error);
    return [];
  }

  return data || [];
}

export async function buscarVinculosCoordenadorCurso() {
  const { data, error } = await supabase
    .from('coordenador_curso')
    .select('coordenador_id, curso_id');

  if (error) {
    console.error("Erro ao buscar vínculos coordenador_curso:", error);
    return [];
  }

  return data || [];
}

export async function buscarCursosIdsPorCoordenador(coordenadorId) {
  if (!coordenadorId) return [];

  const { data, error } = await supabase
    .from('coordenador_curso')
    .select('curso_id')
    .eq('coordenador_id', Number(coordenadorId));

  if (error) {
    console.error("Erro ao buscar cursos do coordenador:", error);
    return [];
  }

  return (data || []).map((row) => Number(row.curso_id));
}

export async function buscarCursosDoBanco() {
  const [{ data, error }, vinculos] = await Promise.all([
    supabase
      .from('curso')
      .select(`
        id, 
        nome, 
        link, 
        icone, 
        tipo, 
        modalidade, 
        descricao,
        coordenador_id,
        coordenador:coordenador_id (id, nome, email, telefone)
      `)
      .order('nome', { ascending: true }),
    buscarVinculosCoordenadorCurso(),
  ]);

  if (error) throw error;

  const mapaCoordsPorCurso = (vinculos || []).reduce((acc, row) => {
    const cursoKey = String(row.curso_id);
    if (!acc[cursoKey]) acc[cursoKey] = new Set();
    if (row.coordenador_id != null) {
      acc[cursoKey].add(Number(row.coordenador_id));
    }
    return acc;
  }, {});

  return (data ?? []).map((curso) => {
    const idsSet = mapaCoordsPorCurso[String(curso.id)] || new Set();
    if (curso.coordenador_id != null) {
      idsSet.add(Number(curso.coordenador_id));
    }

    return {
      id: curso.id,
      nome: curso.nome,
      titulo: curso.nome,
      descricao: curso.descricao || '',
      link: curso.link && curso.link !== 'EMPTY' ? curso.link : null,
      icone: curso.icone || 'book-outline',
      tipo: curso.tipo || 'Presencial',
      modalidade: curso.modalidade || 'Graduação',
      coordenador_id: curso.coordenador_id || null,
      coordenadoresIds: Array.from(idsSet),
      coordenadores: curso.coordenador ? [curso.coordenador] : [],
    };
  });
}

export async function buscarCursoPorId(cursoId) {
  if (!cursoId) return null;

  const { data, error } = await supabase
    .from('curso')
    .select('*')
    .eq('id', cursoId)
    .single();

  if (error) {
    console.error("Erro ao buscar curso por ID:", error);
    return null;
  }

  return data ? (data.titulo || data.nome || `Curso #${cursoId}`) : null;
}

export async function criarCursoNoBanco(novoCurso) {
  const { data, error } = await supabase
    .from('curso')
    .insert([novoCurso])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarCursoNoBanco(id, cursoAtualizado) {
  const { data, error } = await supabase
    .from('curso')
    .update(cursoAtualizado)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removerCursoDoBanco(id) {
  const { error } = await supabase
    .from('curso')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function sincronizarCoordenadoresDoCurso(cursoId, coordenadoresIds = []) {
  const idCurso = Number(cursoId);
  const idsNormalizados = [
    ...new Set((coordenadoresIds || []).map((id) => Number(id)).filter(Boolean)),
  ];

  const { error: deleteError } = await supabase
    .from('coordenador_curso')
    .delete()
    .eq('curso_id', idCurso);

  if (deleteError) throw deleteError;

  if (idsNormalizados.length > 0) {
    const linhas = idsNormalizados.map((coordId) => ({
      curso_id: idCurso,
      coordenador_id: coordId,
    }));

    const { error: insertError } = await supabase
      .from('coordenador_curso')
      .insert(linhas);

    if (insertError) throw insertError;
  }

  return idsNormalizados;
}

export async function buscarCoordenadoresDoCursoNoBanco(cursoId, coordenadorLegado = null) {
  if (!cursoId) {
    return coordenadorLegado ? [coordenadorLegado] : [];
  }

  const { data: vinculos, error: erroVinculos } = await supabase
    .from("coordenador_curso")
    .select("coordenador_id")
    .eq("curso_id", Number(cursoId));

  if (erroVinculos) {
    console.error("Erro ao buscar vínculos coordenador_curso do curso:", erroVinculos);
  }

  const idsSet = new Set(
    (vinculos || [])
      .map((row) => Number(row.coordenador_id))
      .filter((id) => !Number.isNaN(id) && id > 0)
  );

  if (coordenadorLegado?.id) {
    idsSet.add(Number(coordenadorLegado.id));
  }

  let coordsBanco = [];
  if (idsSet.size > 0) {
    const { data: usuarios, error: erroUsuarios } = await supabase
      .from("usuario")
      .select("id, nome, email, telefone, perfil")
      .in("id", Array.from(idsSet))
      .order("nome", { ascending: true });

    if (erroUsuarios) {
      console.error("Erro ao buscar dados dos coordenadores do curso:", erroUsuarios);
    } else {
      coordsBanco = usuarios || [];
    }
  }

  const listaCombinada = [...coordsBanco];
  if (coordenadorLegado && !listaCombinada.some((c) => Number(c.id) === Number(coordenadorLegado.id))) {
    listaCombinada.push(coordenadorLegado);
  }

  // Deduplica por id (ou email) mantendo a ordem
  const vistos = new Set();
  return listaCombinada.filter((coord) => {
    const chave = coord?.id != null ? `id:${coord.id}` : `email:${coord?.email || ""}`;
    if (!chave || vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}