import { supabase } from '../../lib/supabase';
import { mapearEvento } from '../hooks/Calendario';

// buscar cursos do banco
export async function buscarCursosDoBanco() {
  const { data, error } = await supabase
    .from('curso')
    .select('id, nome, link') // Garanta que traz a coluna link
    .order('nome', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((curso) => {
    // Se o link for vazio, null ou a string "EMPTY", definimos como null
    const linkValido = curso.link && curso.link !== 'EMPTY' ? curso.link : null;

    return {
      id: curso.id,
      titulo: curso.nome,
      descricao: 'Conheça este curso da Estácio.',
      modalidade: 'Graduação',
      link: linkValido, // Atribui o link tratado
    };
  });
}

// Fazer login no banco
export async function fazerLoginNoBanco(email, senha) {
  const emailLimpo = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('email', emailLimpo)
    .eq('senha', senha)
    .maybeSingle();

  if (error) {
    throw new Error('Erro ao tentar ligar ao servidor.');
  }

  if (!data) {
    throw new Error('E-mail ou senha incorretos.');
  }

  return data;
}

// Buscar eventos do banco
export async function buscarEventosDoBanco() {
  const { data, error } = await supabase
    .from('evento')
    .select('*, curso(nome)') // Faz o JOIN com a tabela curso para buscar o nome corretamente
    .order('data', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapearEvento);
}

// Criar novo evento no banco
export async function criarEventoNoBanco(novoEvento) {
  const { data, error } = await supabase
    .from('evento')
    .insert([novoEvento])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Atualizar evento no banco
export async function atualizarEventoNoBanco(id, eventoAtualizado) {
  const { data, error } = await supabase
    .from('evento')
    .update(eventoAtualizado)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Remover evento do banco
export async function removerEventoDoBanco(id) {
  const { error } = await supabase
    .from('evento')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Buscar usuarios do banco
export async function buscarUsuariosDoBanco() {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .order('nome', { ascending: true })
    .filter('perfil', 'in', '("Coordenador")'); // Filtra apenas os perfis desejados

  if (error) throw error;
  return data ?? [];
}

// Criar novo usuário no banco
export async function criarUsuarioNoBanco(novoUsuario) {
  const { data, error } = await supabase
    .from('usuario')
    .insert([novoUsuario])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Remover usuário do banco
export async function removerUsuarioDoBanco(id) {
  const { error } = await supabase
    .from('usuario')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function alterarStatusEventoNoBanco(id, novoStatus) {
  const { data, error } = await supabase
    .from('evento')
    .update({ ativo: novoStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}