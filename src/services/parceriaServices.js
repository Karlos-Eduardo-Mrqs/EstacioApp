import { supabase } from '../../lib/supabase';

export async function buscarParceriasDoBanco() {
  const { data, error } = await supabase
    .from('parceria')
    .select('*')
    .order('duracao', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function criarParceriaNoBanco(novaParceria) {
  const { data, error } = await supabase
    .from('parceria')
    .insert([novaParceria])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarParceriaNoBanco(id, dadosAtualizados) {
  const { data, error } = await supabase
    .from('parceria')
    .update(dadosAtualizados)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function excluirParceriaDoBanco(id) {
  const { error } = await supabase
    .from('parceria')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export function obterIconeDaWeb(linkSite) {
  if (!linkSite) return null;
  try {
    const url = new URL(linkSite.startsWith('http') ? linkSite : `https://${linkSite}`);
    // Utiliza o serviço de favicon do Google optimizado para 32x32 pixels
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch (e) {
    return null;
  }
}