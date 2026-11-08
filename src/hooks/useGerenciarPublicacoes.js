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

            // Define a maior dimensão como limite
            const maiorDimensao = Math.max(asset.width, asset.height);

            const fatorReducao = Math.min(1350 / maiorDimensao, 1);

            const novaLargura = Math.round(asset.width * fatorReducao);
            const novaAltura = Math.round(asset.height * fatorReducao);

            const imagemOtimizada = await ImageManipulator.manipulateAsync(
                asset.uri,
                [
                {
                    resize: {
                    width: novaLargura,
                    height: novaAltura
                    }
                }
                ],
                {
                compress: 0.8,
                format: ImageManipulator.SaveFormat.JPEG
                }
            );

            setImagem(imagemOtimizada.uri);
            }

        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            setErro('Não foi possível selecionar ou otimizar a imagem.');

        } finally {
            setCarregandoImagem(false);
        }
    }

    function removerImagem() {
        setImagem(null);
    }

    function abrirNovaPublicacao() {
        setPublicacaoEditando(null);
        setTitulo('');
        setDescricao('');
        setImagem(null); 
        setErro(null);
        setModalPublicacao(true);
    }

    function abrirEdicaoPublicacao(publicacao) {
        setPublicacaoEditando(publicacao);

        setTitulo(publicacao.titulo || '');
        setDescricao(publicacao.descricao || '');

        setImagem(publicacao.imagem?.caminho_img || null);

        setErro(null);
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

            // Verifica se a imagem selecionada é um arquivo local
            const imagemLocal =
            imagem.startsWith('file://') ||
            imagem.startsWith('content://') ||
            imagem.startsWith('blob:');

            // Se for uma imagem nova, faz o upload e cadastra na tabela imagem
            if (imagemLocal) {
            const urlDefinitiva = await fazerUploadParaSupabaseStorage(imagem);

            const novaImagem = await criarImagemNoBanco({
                titulo: `Publicação: ${titulo.trim()}`,
                descricao: descricao.trim(),
                caminho_img: urlDefinitiva
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

    carregandoImagem,
    selecionarImagem,
    salvarPublicacao,

    abrirNovaPublicacao,
    abrirEdicaoPublicacao,
    excluirPublicacao
    };
}