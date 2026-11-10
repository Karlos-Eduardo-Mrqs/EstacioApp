import { supabase } from '../../lib/supabase';

export async function criarImagemNoBanco(novaImagem) {
    const { data, error } = await supabase
        .from('imagem')
        .insert([{
            titulo: novaImagem.titulo,
            descricao: novaImagem.descricao,
            caminho_img: novaImagem.caminho_img,
            caminho_img_original: novaImagem.caminho_img_original
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
        console.error('Erro no upload para o Storage:', error);
        throw error;
    }
}

export async function removerOuSubstituirImagemEvento(eventoEditando) {
  if (!eventoEditando || !eventoEditando.imagem_id) return null;

  const imagemIdAtual = eventoEditando.imagem_id;
  const imagemObj = eventoEditando.imagem;

  // 1. 🔍 Verifica quantos eventos usam esta mesma imagem
  const { data: eventosComMesmaImagem, error: erroConsulta } = await supabase
    .from('evento')
    .select('id')
    .eq('imagem_id', imagemIdAtual);

  if (erroConsulta) throw erroConsulta;

  const qtdUso = eventosComMesmaImagem ? eventosComMesmaImagem.length : 0;

  // 2. Se nenhum outro evento usa e não é a imagem padrão (ID 21), apaga do Storage e do banco
  if (qtdUso <= 1 && imagemIdAtual !== 21) {
    if (imagemObj && imagemObj.caminho_img) {
      const partesUrl = imagemObj.caminho_img.split('/imagensposts/');
      const nomeArquivo = partesUrl.length > 1 ? partesUrl[1] : null;
      if (nomeArquivo) {
        await supabase.storage.from('imagensposts').remove([nomeArquivo]);
      }
      await supabase.from('imagem').delete().eq('id', imagemObj.id);
    }
  }

  // 3. Atualiza o evento no banco associando a imagem padrão (ID 21)
  const novaImagemId = 21;
  const { data, error } = await supabase
    .from('evento')
    .update({ imagem_id: novaImagemId })
    .eq('id', eventoEditando.id)
    .select('*, curso(nome), imagem(*)')
    .single();

  if (error) throw error;
  return data;
}