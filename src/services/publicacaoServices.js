// src/services/publicacaoServices.js
import { supabase } from '../../lib/supabase';

// Buscar publicações de um curso
export async function buscarPublicacoesDoCurso(cursoId) {
  let query = supabase
    .from('post')
    .select(`*, imagem(*), curso(nome)`)
    .order('created_at', { ascending: false });

  if (cursoId) {
    query = query.eq('curso_id', cursoId);
  }

  // Busca os posts e os usuários em paralelo para garantir a associação
  const [resPosts, resUsuarios] = await Promise.all([
    query,
    supabase.from('usuario').select('id, nome') // Ajuste 'usuario' para o nome exato da sua tabela de usuários se necessário
  ]);

  if (resPosts.error) throw resPosts.error;

  const posts = resPosts.data ?? [];
  const usuarios = resUsuarios.data ?? [];

  // Cria um mapa de usuários para busca rápida { [id]: nome }
  const mapaUsuarios = {};
  usuarios.forEach(u => {
    mapaUsuarios[u.id] = u.nome;
  });

  // Injeta o objeto usuario com o nome em cada post com base no usuario_id
  const postsComAutor = posts.map(pub => ({
    ...pub,
    usuario: {
      id: pub.usuario_id,
      nome: mapaUsuarios[pub.usuario_id] || `Coordenador(a) #${pub.usuario_id}`
    }
  }));
  return postsComAutor;
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