import { supabase } from '../../lib/supabase';

export async function buscarEventosDoBanco(usuarioAtual = null) {
  let query = supabase
    .from('evento')
    .select('*, curso(nome), imagem(*)')
    .order('data', { ascending: true });

  // 🔒 Se o usuário for Coordenador, filtra apenas pelos eventos criados por ele
  if (usuarioAtual) {
    const perfilStr = usuarioAtual.perfil ? usuarioAtual.perfil.trim().toLowerCase() : "";
    const ehCoordenador = perfilStr.includes("coordenador");

    if (ehCoordenador && usuarioAtual.id) {
      query = query.eq('usuario_id', usuarioAtual.id);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function criarEventoNoBanco(novoEvento) {
  const { data, error } = await supabase
    .from('evento')
    .insert([novoEvento])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarEventoNoBanco(id, eventoAtualizado, imagemAntigaObj = null) {
  // 1. Atualiza os dados do evento
  const { data, error } = await supabase
    .from('evento')
    .update(eventoAtualizado)
    .eq('id', id)
    .select('*, curso(nome), imagem(*)')
    .single();

  if (error) throw error;

  // 2. Se uma nova imagem foi associada e era diferente da anterior, limpa a antiga do Storage
  if (imagemAntigaObj && eventoAtualizado.imagem_id && imagemAntigaObj.id !== eventoAtualizado.imagem_id) {
    try {
      const caminhoCompleto = imagemAntigaObj.caminho_img;
      if (caminhoCompleto) {
        const partesUrl = caminhoCompleto.split('/imagensposts/');
        const nomeArquivo = partesUrl.length > 1 ? partesUrl[1] : null;
        if (nomeArquivo) {
          await supabase.storage.from('imagensposts').remove([nomeArquivo]);
        }
      }
    } catch (e) {
      console.warn("Aviso ao limpar imagem antiga do storage:", e);
    }
  }

  return data;
}

export async function removerEventoDoBanco(eventoOuId) {
  if (!eventoOuId) {
    throw new Error("ID ou objeto do evento não foi fornecido.");
  }

  let idEvento = eventoOuId;
  let imagemId = null;

  if (typeof eventoOuId === 'object') {
    idEvento = eventoOuId.id;
    imagemId = eventoOuId.imagem_id || eventoOuId.imagem?.id || null;
  }

  if (idEvento && typeof idEvento === 'object') {
    idEvento = idEvento.id;
  }

  // 1. Tenta remover o evento primeiro (evita travar caso a imagem dê conflito de chave estrangeira)
  const { error: erroEvento } = await supabase
    .from('evento')
    .delete()
    .eq('id', idEvento);

  if (erroEvento) {
    throw new Error(erroEvento.message);
  }

  // 2. Se o evento foi apagado com sucesso, remove a imagem associada (se existir)
  if (imagemId) {
    try {
      await supabase
        .from('imagem')
        .delete()
        .eq('id', imagemId);
    } catch (e) {
      console.warn("Aviso: A imagem associada não pôde ser limpa da tabela.", e);
    }
  }

  return true;
}

