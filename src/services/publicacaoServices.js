
import { supabase } from '../../lib/supabase';

// Buscar publicações de um curso
export async function buscarPublicacoesDoCurso(cursoId) {
  const { data, error } = await supabase
    .from('post')
    .select('*, imagem(*), curso(nome)')
    .eq('curso_id', cursoId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

// Criar publicação
export async function criarPublicacaoNoBanco(novaPublicacao) {
  const { data, error } = await supabase
    .from('post')
    .insert([novaPublicacao])
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Atualizar publicação
export async function atualizarPublicacaoNoBanco(id, publicacaoAtualizada) {
  const { data, error } = await supabase
    .from('post')
    .update(publicacaoAtualizada)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Remover publicação
export async function removerPublicacaoDoBanco(id) {
  const { error } = await supabase
    .from('post')
    .delete()
    .eq('id', id);

  if (error) throw error;
}