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

export const padronizarProporcaoImagem = async (uriOriginal) => {
  try {
    const resultado = await ImageManipulator.manipulateAsync(
      uriOriginal,
      [
        {
          resize: {
            width: 1200,
            height: 675, // Força a proporção exata de banner 16:9
          },
        },
      ],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    return resultado.uri;
  } catch (error) {
    console.error("Erro ao padronizar imagem:", error);
    return uriOriginal;
  }
};

export async function fazerUploadParaSupabaseStorage(uriLocal, tituloEvento = '') {
  try {
    // 1. Padroniza a proporção antes do envio
    const uriFormatada = await padronizarProporcaoImagem(uriLocal);

    // 2. Formata o título para o nome do arquivo
    const tituloLimpo = tituloEvento
      ? tituloEvento
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .substring(0, 30)
      : 'capa';

    const nomeArquivo = `${tituloLimpo}_${Date.now()}.jpg`;
    
    const resposta = await fetch(uriFormatada);
    const blob = await resposta.blob();

    const { data, error } = await supabase.storage
      .from('imagensposts') 
      .upload(nomeArquivo, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: urlPublica } = supabase.storage
      .from('imagensposts') 
      .getPublicUrl(data.path);

    return urlPublica.publicUrl;
  } catch (error) {
    console.error("Erro no upload para o Storage:", error);
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