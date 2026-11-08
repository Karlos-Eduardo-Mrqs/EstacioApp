import { supabase } from '../../lib/supabase';

// Buscar todos os serviços com dados relacionais do Coordenador e do Curso
export async function buscarServicosDoBanco() {
  const { data, error } = await supabase
    .from('servico')
    .select(`
      id,
      nome,
      descricao,
      dias,
      aviso,
      links_uteis,
      status,
      coordenador_id,
      curso_id,
      coordenador:coordenador_id (id, nome, email, telefone, perfil),
      cursoRel:curso_id (id, nome)
    `)
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }

  return (data || []).map((item) => ({
    id: String(item.id),
    nome: item.nome || '',
    descricao: item.descricao || '',
    dias: item.dias || '',
    aviso: item.aviso || '',
    linksUteis: item.links_uteis || '',
    status: item.status || 'Ativo',
    coordenador_id: item.coordenador_id ? String(item.coordenador_id) : '',
    curso_id: item.curso_id ? String(item.curso_id) : '',
    // Dados formatados para exibição compatíveis com o design original
    responsavel: item.coordenador?.nome || 'A definir',
    email: item.coordenador?.email || 'A definir',
    telefone: item.coordenador?.telefone || 'A definir',
    cargo: item.coordenador?.perfil || 'Coordenador',
    curso: item.cursoRel?.nome || 'Todos',
  }));
}

export async function criarServicoNoBanco(novoServico) {
  const { data, error } = await supabase
    .from('servico')
    .insert([novoServico])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarServicoNoBanco(id, servicoAtualizado) {
  const { data, error } = await supabase
    .from('servico')
    .update(servicoAtualizado)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removerServicoDoBanco(id) {
  const { error } = await supabase
    .from('servico')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}