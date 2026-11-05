import { supabase } from '../../lib/supabase';

export async function buscarCursosDoBanco() {
  const { data, error } = await supabase
    .from('curso')
    .select('id, nome, link, icone, tipo, modalidade, descricao') // Garanta que a ordem e colunas batem com o banco
    .order('nome', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((curso) => ({
    id: curso.id,
    nome: curso.nome,
    descricao: curso.descricao || '', // Usa o valor do banco ou vazio se não houver
    link: curso.link && curso.link !== 'EMPTY' ? curso.link : null,
    icone: curso.icone || 'book-outline',
    tipo: curso.tipo || 'Presencial',
    modalidade: curso.modalidade || 'Graduação',
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