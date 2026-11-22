import { supabase } from '../../lib/supabase';

function normalizarEvento(ev) {
  if (!ev) return ev;
  const dataInicio = ev.data_inicio ?? ev.data ?? null;
  const dataFim = ev.data_fim ?? null;
  return {
    ...ev,
    data_inicio: dataInicio,
    data_fim: dataFim,
    data: dataInicio,
  };
}

export async function buscarEventosDoBanco(usuarioAtual = null) {
  let query = supabase
    .from('evento')
    .select('*, curso(nome), imagem(*)')
    .order('data_inicio', { ascending: true });

  if (usuarioAtual) {
    const perfilStr = usuarioAtual.perfil ? usuarioAtual.perfil.trim().toLowerCase() : "";
    const ehCoordenador = perfilStr.includes("coordenador");

    if (ehCoordenador && usuarioAtual.id) {
      query = query.eq('usuario_id', usuarioAtual.id);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []).map(normalizarEvento);
}

export async function criarEventoNoBanco(novoEvento) {
  const { data, error } = await supabase
    .from('evento')
    .insert([novoEvento])
    .select()
    .single();

  if (error) throw error;
  return normalizarEvento(data);
}

export async function atualizarEventoNoBanco(id, eventoAtualizado, imagemAntigaObj = null) {
  const { data, error } = await supabase
    .from('evento')
    .update(eventoAtualizado)
    .eq('id', id)
    .select('*, curso(nome), imagem(*)')
    .single();

  if (error) throw error;

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

  return normalizarEvento(data);
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

  const { error: erroEvento } = await supabase
    .from('evento')
    .delete()
    .eq('id', idEvento);

  if (erroEvento) {
    throw new Error(erroEvento.message);
  }

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
