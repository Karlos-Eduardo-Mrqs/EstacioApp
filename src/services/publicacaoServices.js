// src/services/publicacaoServices.js
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

// 📤 Função de upload dedicada para o storage "imagenspublicacoes"
export async function fazerUploadParaSupabaseStorage(uriLocal) {
  try {
    const nomeArquivo = `pub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
    
    const resposta = await fetch(uriLocal);
    const blob = await resposta.blob();

    const { data, error } = await supabase.storage
      .from('imagenspublicacoes') // 👈 Apontando para o novo storage solicitado
      .upload(nomeArquivo, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: urlPublica } = supabase.storage
      .from('imagenspublicacoes')
      .getPublicUrl(data.path);

    return urlPublica.publicUrl;

  } catch (error) {
    console.error('Erro no upload para o Storage imagenspublicacoes:', error);
    throw error;
  }
}