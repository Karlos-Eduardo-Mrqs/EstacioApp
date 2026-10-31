import { supabase } from '../../lib/supabase';

export async function fazerLoginNoBanco(email, senha) {
  const emailLimpo = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('email', emailLimpo)
    .eq('senha', senha)
    .maybeSingle();

  if (error) throw new Error('Erro ao tentar ligar ao servidor.');
  if (!data) throw new Error('E-mail ou senha incorretos.');

  return data;
}

export async function buscarUsuariosDoBanco() {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .order('nome', { ascending: true })
    .filter('perfil', 'in', '("Coordenador")');

  if (error) throw error;
  return data ?? [];
}

export async function criarUsuarioNoBanco(novoUsuario) {
  const { data, error } = await supabase
    .from('usuario')
    .insert([novoUsuario])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removerUsuarioNoBanco(id) {
  const { error } = await supabase
    .from('usuario')
    .delete()
    .eq('id', id);

  if (error) throw error;
}