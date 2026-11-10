import { supabase } from '../../lib/supabase';

// Função para buscar a lista de coordenadores disponíveis para preencher o Select
export async function buscarCoordenadoresDoBanco() {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nome, email, telefone, perfil')
    .eq('perfil', 'Coordenador') // Busca exata pelo perfil Coordenador
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar coordenadores:", error);
    return [];
  }

  return data || [];
}

export async function buscarCursosDoBanco() {
  const { data, error } = await supabase
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
    .order('nome', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((curso) => ({
    id: curso.id,
    nome: curso.nome,
    titulo: curso.nome,
    descricao: curso.descricao || '',
    link: curso.link && curso.link !== 'EMPTY' ? curso.link : null,
    icone: curso.icone || 'book-outline',
    tipo: curso.tipo || 'Presencial',
    modalidade: curso.modalidade || 'Graduação',
    coordenador_id: curso.coordenador_id || null,
    // Se houver coordenador vinculado via JOIN, inclui no objeto
    coordenadores: curso.coordenador ? [curso.coordenador] : [],
  }));
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