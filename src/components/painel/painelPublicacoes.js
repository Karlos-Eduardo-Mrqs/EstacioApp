import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native';

import { useGerenciarPublicacoes } from '../../hooks/useGerenciarPublicacoes';
import ModalGerenciarPublicacao from './modalGerenciarPublicacoes';
import ConfirmPopup from '../ConfirmPopup';
import FeedbackBox from '../FeedPopup';


export default function PainelPublicacoes({ usuarioAtual }) {
    const {
        publicacoes,
        carregando,
        erro,
        modalPublicacao,
        setModalPublicacao,
        publicacaoEditando,
        titulo,
        setTitulo,
        descricao,
        setDescricao,
        imagem,
        carregandoImagem,
        selecionarImagem,
        removerImagem,
        salvarPublicacao,
        abrirNovaPublicacao,
        abrirEdicaoPublicacao,
        excluirPublicacao
    } = useGerenciarPublicacoes(usuarioAtual?.curso_id);

    const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);

    function alternarDescricao(id) {
        setPublicacoesExpandidas(prev =>
        prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
    }

    const [confirmPopup, setConfirmPopup] = useState({
        visible: false,
        titulo: '',
        mensagem: '',
        onConfirm: null,
        tipo: 'danger'
    });

    function solicitarExclusao(publicacao) {
        setConfirmPopup({
        visible: true,
        titulo: 'Excluir publicação',
        mensagem: `Deseja realmente excluir "${publicacao.titulo}"?`,
        tipo: 'danger',
        onConfirm: async () => {
            const sucesso = await excluirPublicacao(publicacao);

            if (sucesso) {
                setConfirmPopup(prev => ({
                ...prev,
                visible: false
                }));
            }}
        });
    }

    function precisaExpandir(descricao) {
        const linhas = descricao.split('\n');

        return descricao.length > 100 || linhas.length > 3;
    }

    return (
        <View style={{
        marginTop: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12
        }}>

        <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#032551'
        }}>
            Publicações do curso
        </Text>

        <TouchableOpacity onPress={abrirNovaPublicacao}>
            <Text>+ Nova publicação</Text>
        </TouchableOpacity>

        {erro && (
            <FeedbackBox tipo="erro" mensagem={erro} />
        )}

        {carregando ? (
            <ActivityIndicator />
        ) : publicacoes.length === 0 ? (
            <Text>Nenhuma publicação cadastrada.</Text>
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {publicacoes.map(publicacao => (
                <View
                key={publicacao.id}
                style={{
                    width: 220,
                    marginRight: 12,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    borderRadius: 10
                }}
                >
                {publicacao.imagem?.caminho_img && (
                    <Image
                    source={{ uri: publicacao.imagem.caminho_img }}
                    style={{
                        width: '100%',
                        aspectRatio: 4 / 5,
                        backgroundColor: '#F1F5F9',
                        borderRadius: 8
                    }}
                    resizeMode="contain"
                    />
                )}

                <Text style={{ fontWeight: 'bold', marginTop: 8 }}>
                    {publicacao.titulo}
                </Text>

                {/* <Text numberOfLines={3}>
                    {publicacao.descricao}
                </Text> */}

                <Text numberOfLines={
                    publicacoesExpandidas.includes(publicacao.id) ? undefined: 3}> {publicacao.descricao}
                </Text>

                {precisaExpandir(publicacao.descricao) && (
                <TouchableOpacity
                    onPress={() => alternarDescricao(publicacao.id)}
                >
                    <Text style={{
                        color: '#2563EB',
                        fontWeight: '600',
                        marginTop: 4
                    }}>
                        {publicacoesExpandidas.includes(publicacao.id) ? 'Ver menos' : 'Ver mais'}
                    </Text>
                </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={() => abrirEdicaoPublicacao(publicacao)}
                >
                    <Text>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => solicitarExclusao(publicacao)}
                >
                    <Text>Excluir</Text>
                </TouchableOpacity>
                </View>
            ))}
            </ScrollView>
        )}

        <ModalGerenciarPublicacao
            visible={modalPublicacao}
            onClose={() => setModalPublicacao(false)}
            publicacaoEditando={publicacaoEditando}
            titulo={titulo}
            setTitulo={setTitulo}
            descricao={descricao}
            setDescricao={setDescricao}
            imagem={imagem}
            selecionarImagem={selecionarImagem}
            removerImagem={removerImagem}
            salvarPublicacao={salvarPublicacao}
            carregando={carregando}
            carregandoImagem={carregandoImagem}
            feedback={{
                tipo: 'erro',
                mensagem: erro
            }}
        />

        <ConfirmPopup
            visible={confirmPopup.visible}
            titulo={confirmPopup.titulo}
            mensagem={confirmPopup.mensagem}
            tipo={confirmPopup.tipo}
            onConfirm={confirmPopup.onConfirm}
            onClose={() =>
            setConfirmPopup(prev => ({ ...prev, visible: false }))
            }
        />

        </View>
    );
}