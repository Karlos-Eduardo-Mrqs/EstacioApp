import { supabase } from '../../lib/supabase';

export async function buscarEventosDoBanco() {
  const { data, error } = await supabase
    .from('evento')
    .select('*, curso(nome), imagem(*)')
    .order('data', { ascending: true });

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

export async function atualizarEventoNoBanco(id, eventoAtualizado) {
  const { data, error } = await supabase
    .from('evento')
    .update(eventoAtualizado)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
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

export async function alterarStatusEventoNoBanco(id, novoStatus) {
  const { data, error } = await supabase
    .from('evento')
    .update({ status: novoStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}