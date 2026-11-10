import { useState, useEffect, useCallback } from 'react';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import {
  buscarPublicacoesDoCurso,
  criarPublicacaoNoBanco,
  atualizarPublicacaoNoBanco,
  removerPublicacaoDoBanco
} from '../services/publicacaoServices';

import {
  criarImagemNoBanco,
  atualizarImagemNoBanco,
  fazerUploadParaSupabaseStorage
} from '../services/imagemServices';

export function useGerenciarPublicacoes(cursoId) {
    const [publicacoes, setPublicacoes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    const [modalPublicacao, setModalPublicacao] = useState(false);
    const [publicacaoEditando, setPublicacaoEditando] = useState(null);

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState(null);
    const [carregandoImagem, setCarregandoImagem] = useState(false);

    const [imagemOriginal, setImagemOriginal] = useState(null);
    const [editorAberto, setEditorAberto] = useState(false);

    async function selecionarImagem() {
        try {
            setCarregandoImagem(true);

            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 1
            });

            if (!resultado.canceled && resultado.assets?.length) {
                const asset = resultado.assets[0];

                setImagemOriginal({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height
                });

                setEditorAberto(true);
            }

        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            setErro('Não foi possível selecionar a imagem.');
        } finally {
            setCarregandoImagem(false);
        }
    }

    async function confirmarRecorte(recorte) {
        try {
            if (!imagemOriginal?.uri) {
                throw new Error('Imagem original não encontrada.');
            }

            setCarregandoImagem(true);
            setErro(null);

            const resultado = await ImageManipulator.manipulateAsync(
                imagemOriginal.uri,
                [
                    {
                        crop: recorte
                    }
                ],
                {
                    compress: 0.9,
                    format: ImageManipulator.SaveFormat.JPEG
                }
            );

            setImagem(resultado.uri);
            setEditorAberto(false);

        } catch (error) {
            console.error('Erro ao recortar imagem:', error);
            setErro('Não foi possível recortar a imagem.');
        } finally {
            setCarregandoImagem(false);
        }
    }


    function removerImagem() {
        setImagem(null);
        setImagemOriginal(null);
        setEditorAberto(false);
    }

    function abrirNovaPublicacao() {
        setPublicacaoEditando(null);
        setTitulo('');
        setDescricao('');
        setImagem(null); 
        setErro(null);
        setModalPublicacao(true);
        setImagemOriginal(null);
        setEditorAberto(false);
    }

    function abrirEdicaoPublicacao(publicacao) {
        setPublicacaoEditando(publicacao);

        setTitulo(publicacao.titulo || '');
        setDescricao(publicacao.descricao || '');

        setImagem(publicacao.imagem?.caminho_img || null);

        setImagemOriginal(
            publicacao.imagem?.caminho_img_original
                ? {
                    uri: publicacao.imagem.caminho_img_original,
                    width: null,
                    height: null
                }
                : null
        );

        setEditorAberto(false);
        setModalPublicacao(true);
    }

    async function excluirPublicacao(publicacao) {
    try {
        setCarregando(true);
        setErro(null);

        await removerPublicacaoDoBanco(publicacao.id);

        setPublicacoes(prev =>
        prev.filter(item => item.id !== publicacao.id)
        );

        return true;

    } catch (error) {
        console.error('Erro ao excluir publicação:', error);
        setErro('Não foi possível excluir a publicação.');
        return false;

    } finally {
        setCarregando(false);
    }
    }

    
    async function salvarPublicacao() {
        if (!titulo.trim() || !descricao.trim() || !imagem || !cursoId) {
            setErro('Preencha o título, a descrição e selecione uma imagem.');
            return;
        }

        try {
            setCarregando(true);
            setErro(null);

            let imagemId = publicacaoEditando?.imagem_id || null;

            // Verifica se o recorte é um arquivo local
            const imagemLocal =
                imagem.startsWith('file://') ||
                imagem.startsWith('content://') ||
                imagem.startsWith('blob:');

            // Se houver uma nova imagem, envia as duas versões
            if (imagemLocal) {
                if (!imagemOriginal?.uri) {
                    throw new Error('Imagem original não encontrada.');
                }

                // Upload da imagem recortada
                const urlRecortada = await fazerUploadParaSupabaseStorage(imagem);

                // Upload da imagem original
                const urlOriginal = await fazerUploadParaSupabaseStorage(
                    imagemOriginal.uri
                );

                // Cadastra os dois caminhos no banco
                const novaImagem = await criarImagemNoBanco({
                    titulo: `Publicação: ${titulo.trim()}`,
                    descricao: descricao.trim(),
                    caminho_img: urlRecortada,
                    caminho_img_original: urlOriginal
                });

                imagemId = novaImagem.id;
            }

            const payloadPublicacao = {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                curso_id: Number(cursoId),
                imagem_id: imagemId
            };

            if (publicacaoEditando) {
                await atualizarPublicacaoNoBanco(
                    publicacaoEditando.id,
                    payloadPublicacao
                );
            } else {
                await criarPublicacaoNoBanco(payloadPublicacao);
            }

            setModalPublicacao(false);
            setPublicacaoEditando(null);
            setTitulo('');
            setDescricao('');
            setImagem(null);
            setImagemOriginal(null);
            setEditorAberto(false);

            await carregarPublicacoes();

        } catch (error) {
            console.error('Erro ao salvar publicação:', error);
            setErro('Não foi possível salvar a publicação.');
        } finally {
            setCarregando(false);
        }
    }


    const carregarPublicacoes = useCallback(async () => {
    if (!cursoId) return;

    try {
        setCarregando(true);
        setErro(null);

        const dados = await buscarPublicacoesDoCurso(cursoId);

        setPublicacoes(dados);
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        setErro('Não foi possível carregar as publicações.');
    } finally {
        setCarregando(false);
    }
    }, [cursoId]);

    useEffect(() => {
    carregarPublicacoes();
    }, [carregarPublicacoes]);

    return {
    publicacoes,
    carregando,
    erro,
    carregarPublicacoes,

    modalPublicacao,
    setModalPublicacao,
    publicacaoEditando,
    setPublicacaoEditando,

    titulo,
    setTitulo,
    descricao,
    setDescricao,
    imagem,
    setImagem,
    removerImagem,
    confirmarRecorte,

    carregandoImagem,
    selecionarImagem,
    salvarPublicacao,
    salvarPublicacao,

    abrirNovaPublicacao,
    abrirEdicaoPublicacao,
    excluirPublicacao,

    imagemOriginal,
    setImagemOriginal,
    editorAberto,
    setEditorAberto
    };
}