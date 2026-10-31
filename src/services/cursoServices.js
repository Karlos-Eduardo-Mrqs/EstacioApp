import { supabase } from '../../lib/supabase';

export async function buscarCursosDoBanco() {
  const { data, error } = await supabase
    .from('curso')
    .select('id, nome, link')
    .order('nome', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((curso) => ({
    id: curso.id,
    titulo: curso.nome,
    descricao: 'Conheça este curso da Estácio.',
    modalidade: 'Graduação',
    link: curso.link && curso.link !== 'EMPTY' ? curso.link : null,
  }));
}