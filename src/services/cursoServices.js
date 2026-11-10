import { supabase } from '../../lib/supabase';

export async function buscarCursosDoBanco() {
  const { data, error } = await supabase
    .from('curso')
    .select('id, nome, link, icone') // 👈 Inclui a coluna icone
    .order('nome', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((curso) => ({
    id: curso.id,
    titulo: curso.nome,
    descricao: 'Conheça este curso da Estácio.',
    modalidade: 'Graduação',
    link: curso.link && curso.link !== 'EMPTY' ? curso.link : null,
    icone: curso.icone || 'book-outline', // 👈 Retorna o ícone do banco ou um padrão
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