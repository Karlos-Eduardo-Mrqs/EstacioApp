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
    responsavel: item.coordenador?.nome || 'A definir',
    email: item.coordenador?.email || 'A definir',
    telefone: item.coordenador?.telefone || 'A definir',
    cargo: item.coordenador?.perfil || 'Coordenador',
    curso: item.cursoRel?.nome || 'Todos',
  }));
}

export function filtrarServicos(servicos = [], { pesquisa = '', usuarioAtual = null } = {}) {
  const perfilNorm = usuarioAtual?.perfil
    ? usuarioAtual.perfil.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : "";
  const ehCoord = perfilNorm.includes("coordenador");
  const termo = pesquisa.toLowerCase();

  return (servicos || []).filter((item) => {
    if (ehCoord) {
      return (
        Number(item.coordenador_id || item.coordenadorId) === Number(usuarioAtual?.id) ||
        Number(item.curso_id || item.cursoId) === Number(usuarioAtual?.curso_id)
      );
    }

    return (
      item.nome?.toLowerCase().includes(termo) ||
      item.responsavel?.toLowerCase().includes(termo) ||
      item.curso?.toLowerCase().includes(termo)
    );
  });
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
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    console.error("Erro detalhado do Supabase ao atualizar:", error);
    throw error;
  }
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