import { supabase } from '../../lib/supabase';
import { mapearEvento } from '../hooks/Calendario';

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

export async function buscarEventosDoBanco() {
  const { data, error } = await supabase
    .from('evento')
    .select('*, curso(nome)') // Faz o JOIN com a tabela curso para buscar o nome corretamente
    .order('data', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapearEvento);
}