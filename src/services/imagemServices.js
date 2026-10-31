import { supabase } from '../../lib/supabase';

export async function criarImagemNoBanco(novaImagem) {
  const { data, error } = await supabase
    .from('imagem')
    .insert([{
      titulo: novaImagem.titulo,
      descricao: novaImagem.descricao,
      caminho_img: novaImagem.caminho_img
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarImagemNoBanco(id, imagemAtualizada) {
  const { data, error } = await supabase
    .from('imagem')
    .update(imagemAtualizada)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fazerUploadParaSupabaseStorage(uriLocal) {
  try {
    const nomeArquivo = `capa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
    
    const resposta = await fetch(uriLocal);
    const blob = await resposta.blob();

    // 🎯 Usa o nome exato do bucket que está criado no seu painel ('imagensposts')
    const { data, error } = await supabase.storage
      .from('imagensposts') 
      .upload(nomeArquivo, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: urlPublica } = supabase.storage
      .from('imagensposts') // 🎯 Garante que busca a URL pública do mesmo bucket
      .getPublicUrl(data.path);

    return urlPublica.publicUrl;
  } catch (error) {
    console.error("Erro no upload para o Storage:", error);
    throw error;
  }
}