import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // 👈 Importado para compressão
import { fazerUploadParaSupabaseStorage } from '../services/publicacaoServices';

export function useGerenciarPublicacoes(cursoIdFiltro, usuarioAtual) {
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState(''); // 👈 Novo estado para a busca de posts  
  const [modalPublicacao, setModalPublicacao] = useState(false);
  const [publicacaoEditando, setPublicacaoEditando] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null); 
  const [proporcao, setProporcao] = useState('16:9'); 
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  // 🔔 Estado do ToastPopup de Feedback
  const [toast, setToast] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    tipo: 'sucesso', // 'sucesso' ou 'erro'
  });

  function dispararToast(titulo, mensagem, tipo = 'sucesso') {
    setToast({ visible: true, titulo, mensagem, tipo });
  }

  async function buscarPublicacoes() {
    try {
      setCarregando(true);
      let query = supabase
        .from('post')
        .select(`
          *,
          curso:curso_id (
            id,
            nome
          ),
          imagem:imagem_id (
            id,
            caminho_img,
            proporcao
          )
        `)
        .order('created_at', { ascending: false });

      const perfilNorm = usuarioAtual?.perfil ? usuarioAtual.perfil.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
      const ehCoord = perfilNorm.includes("coordenador");

      if (ehCoord) {
        // Coordenador vê estritamente apenas os posts criados por ele próprio
        query = query.eq('usuario_id', usuarioAtual.id);
      } else if (cursoIdFiltro) {
        query = query.eq('curso_id', cursoIdFiltro);
      }

      const { data, error } = await query;
      if (error) throw error;

      const posts = data ?? [];
      const { data: usuarios } = await supabase.from('usuario').select('id, nome');
      const mapaUsuarios = {};
      (usuarios || []).forEach(u => { mapaUsuarios[u.id] = u.nome; });

      const postsComAutor = posts.map(pub => ({
        ...pub,
        usuario: {
          id: pub.usuario_id,
          nome: mapaUsuarios[pub.usuario_id] || `Coordenador(a) #${pub.usuario_id}`
        }
      }));

      setPublicacoes(postsComAutor);
    } catch (err) {
      dispararToast('Erro', 'Não foi possível carregar as publicações.', 'erro');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarPublicacoes();
  }, [cursoIdFiltro]);

  // 🔍 Filtro inteligente baseado na barra de pesquisa (título ou descrição)
  const publicacoesFiltradas = publicacoes.filter(pub => {
    const termo = busca.toLowerCase();
    return (
      pub.titulo?.toLowerCase().includes(termo) ||
      pub.descricao?.toLowerCase().includes(termo)
    );
  });

  useEffect(() => {
    buscarPublicacoes();
  }, [cursoIdFiltro]);

  function abrirNovaPublicacao() {
    setPublicacaoEditando(null);
    setTitulo('');
    setDescricao('');
    setImagem(null);
    setProporcao('16:9');
    setModalPublicacao(true);
  }

  function abrirEdicaoPublicacao(pub) {
    setPublicacaoEditando(pub);
    setTitulo(pub.titulo || '');
    setDescricao(pub.descricao || '');
    
    const urlImg = typeof pub.imagem === 'object' ? pub.imagem?.caminho_img : pub.imagem;
    setImagem(urlImg || null);
    
    const proporcaoSalva = pub.imagem?.proporcao || '16:9';
    setProporcao(proporcaoSalva);
    
    setModalPublicacao(true);
  }

  async function selecionarImagem() {
    try {
      setCarregandoImagem(true);
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        const ativo = resultado.assets[0];
        setImagem(ativo.uri);
      }
    } catch (err) {
      dispararToast('Atenção', 'Erro ao selecionar imagem da galeria.', 'erro');
    } finally {
      setCarregandoImagem(false);
    }
  }

  function removerImagem() {
    setImagem(null);
  }

  async function salvarPublicacao() {
    if (!titulo.trim() || !descricao.trim()) {
      dispararToast('Atenção', 'Preencha o título e a descrição.', 'erro');
      return;
    }

    try {
      setCarregando(true);
      let urlImagemFinal = imagem;

      // 1. Se a imagem foi alterada e é um arquivo local novo (file:// ou blob:)
      if (imagem && (imagem.startsWith('file://') || imagem.startsWith('blob:'))) {
        try {
          const acoesManipulacao = [{ resize: { width: 1200 } }];
          const resultadoCompressao = await ImageManipulator.manipulateAsync(
            imagem,
            acoesManipulacao,
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          
          if (resultadoCompressao?.uri) {
            urlImagemFinal = await fazerUploadParaSupabaseStorage(resultadoCompressao.uri);
          }
        } catch (e) {
          console.warn("Falha na compressão, enviando imagem original:", e);
          urlImagemFinal = await fazerUploadParaSupabaseStorage(imagem);
        }
      }

      let imagemIdFinal = publicacaoEditando?.imagem_id || null;
      const imagemAntigaObj = publicacaoEditando?.imagem || null;

      // 2. Gerenciamento da tabela "imagem"
      if (urlImagemFinal && typeof urlImagemFinal === 'string') {
        // Se já existia uma imagem vinculada e a URL mudou (foi substituída)
        if (imagemIdFinal && imagemAntigaObj?.caminho_img !== urlImagemFinal && !urlImagemFinal.startsWith('file://')) {
          
          // Atualiza a imagem existente no banco com a nova URL e proporção
          await supabase
            .from('imagem')
            .update({
              caminho_img: urlImagemFinal,
              proporcao: proporcao,
              titulo: `Banner: ${titulo}`,
            })
            .eq('id', imagemIdFinal);

          // Opcional: Limpar a imagem antiga do storage se necessário
          try {
            const partesUrl = imagemAntigaObj.caminho_img.split('/imagenspublicacoes/');
            const nomeArquivoAntigo = partesUrl.length > 1 ? partesUrl[1] : null;
            if (nomeArquivoAntigo) {
              await supabase.storage.from('imagenspublicacoes').remove([nomeArquivoAntigo]);
            }
          } catch (storageErr) {
            console.warn("Aviso ao remover imagem antiga do storage:", storageErr);
          }

        } else if (!imagemIdFinal) {
          // Se não tinha imagem antes, cria um novo registro na tabela "imagem"
          const { data: novaImagemData, error: erroImg } = await supabase
            .from('imagem')
            .insert([{
              caminho_img: urlImagemFinal,
              proporcao: proporcao,
              titulo: `Banner: ${titulo}`,
              descricao: descricao.substring(0, 100),
            }])
            .select()
            .single();

          if (erroImg) throw erroImg;
          if (novaImagemData) {
            imagemIdFinal = novaImagemData.id;
          }
        } else if (imagemIdFinal) {
          // Apenas atualiza a proporção caso tenha mudado, mantendo a mesma imagem
          await supabase
            .from('imagem')
            .update({ proporcao: proporcao })
            .eq('id', imagemIdFinal);
        }
      } else if (!imagem && imagemIdFinal) {
        // Se o usuário removeu totalmente a imagem
        imagemIdFinal = null;
      }

      // 3. Salvar os dados na tabela "post"
      const dadosPublicacao = {
        titulo,
        descricao,
        curso_id: cursoIdFiltro || null,
        usuario_id: usuarioAtual?.id || null,
        imagem_id: imagemIdFinal,
      };

      if (publicacaoEditando) {
        const { error } = await supabase
          .from('post')
          .update(dadosPublicacao)
          .eq('id', publicacaoEditando.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post')
          .insert([dadosPublicacao]);

        if (error) throw error;
      }

      setModalPublicacao(false);
      buscarPublicacoes();
      dispararToast('Sucesso', 'Publicação salva com sucesso!', 'sucesso');
    } catch (err) {
      dispararToast('Erro', 'Erro ao salvar a publicação: ' + err.message, 'erro');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirPublicacao(pub) {
    try {
      const imagemId = pub.imagem_id || pub.imagem?.id || null;
      const caminhoImg = typeof pub.imagem === 'object' ? pub.imagem?.caminho_img : pub.imagem;

      // 1. Apaga a publicação da tabela 'post' primeiro
      const { error: erroPost } = await supabase
        .from('post')
        .delete()
        .eq('id', pub.id);

      if (erroPost) throw erroPost;

      // 2. Se a publicação possuía uma imagem associada, vamos verificar o uso dela
      if (imagemId) {
        // Verifica quantos posts ainda utilizam essa mesma imagem
        const { data: postsComMesmaImagem, error: erroConsulta } = await supabase
          .from('post')
          .select('id')
          .eq('imagem_id', imagemId);

        if (!erroConsulta) {
          const qtdUso = postsComMesmaImagem ? postsComMesmaImagem.length : 0;

          // Se nenhum outro post usa essa imagem, podemos removê-la do banco e do storage!
          if (qtdUso === 0) {
            // Remove do Storage (se houver o caminho válido)
            if (caminhoImg) {
              try {
                const partesUrl = caminhoImg.split('/imagenspublicacoes/');
                const nomeArquivo = partesUrl.length > 1 ? partesUrl[1] : null;
                if (nomeArquivo) {
                  await supabase.storage.from('imagenspublicacoes').remove([nomeArquivo]);
                }
              } catch (storageErr) {
                console.warn("Aviso ao remover arquivo do storage imagenspublicacoes:", storageErr);
              }
            }

            // Remove o registro da tabela 'imagem'
            await supabase
              .from('imagem')
              .delete()
              .eq('id', imagemId);
          }
        }
      }

      // Atualiza o estado local removendo o post excluído
      setPublicacoes((prev) => prev.filter((p) => p.id !== pub.id));
      dispararToast('Sucesso', 'Publicação excluída com sucesso!', 'sucesso');
      return true;
    } catch (err) {
      dispararToast('Erro', 'Não foi possível excluir a publicação: ' + err.message, 'erro');
      return false;
    }
  }

  return {
    publicacoes: publicacoesFiltradas, // 👈 Retorna a lista filtrada
    publicacoesBrutas: publicacoes,
    carregando,
    modalPublicacao,
    setModalPublicacao,
    publicacaoEditando,
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    imagem,
    proporcao,
    setProporcao,
    carregandoImagem,
    abrirNovaPublicacao,
    abrirEdicaoPublicacao,
    selecionarImagem,
    removerImagem,
    salvarPublicacao,
    excluirPublicacao,
    toast,
    setToast,
    busca, setBusca
  };
}