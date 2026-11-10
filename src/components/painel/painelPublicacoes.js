import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';

import { useGerenciarPublicacoes } from '../../hooks/useGerenciarPublicacoes';
import ConfirmPopup from '../ConfirmPopup';
import CustomIcon from '../CustomIcon';
import FeedbackBox from '../FeedPopup';
import ModalGerenciarPublicacao from './modalGerenciarPublicacoes';

export default function PainelPublicacoes({ usuarioAtual }) {
    const {
        publicacoes,
        carregando,
        erro,
        modalPublicacao,

        imagemOriginal,
        editorAberto,
        setEditorAberto,
        confirmarRecorte,

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

    const { width: larguraTela } = useWindowDimensions();

    const larguraCard = larguraTela < 600 ? '100%' : larguraTela < 1000 ? '48%' : '23%';

    const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);
    const [imagemOriginalSelecionada, setImagemOriginalSelecionada] = useState(null);
    const [modalImagemOriginal, setModalImagemOriginal] = useState(false);

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

    function visualizarImagemOriginal(publicacao) {

        const caminhoOriginal = publicacao.imagem?.caminho_img_original;

        if (!caminhoOriginal) {
            return;
        }

        setImagemOriginalSelecionada(caminhoOriginal);
        setModalImagemOriginal(true);
    }

    function precisaExpandir(descricao) {
        const linhas = descricao.split('\n');

        return descricao.length > 100 || linhas.length > 3;
    }

    return (
        <View style={{
            marginTop: 20,
            padding: 20,
            backgroundColor: '#F4F6F8',
            borderRadius: 12
            }}>

            {/* Cabeçalho */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 20
            }}>
                <View>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#032551'
                }}>
                    Publicações do curso
                </Text>

                <Text style={{
                    fontSize: 13,
                    color: '#64748B',
                    marginTop: 4
                }}>
                    Gerencie os avisos e comunicados do seu curso.
                </Text>
                </View>

            <TouchableOpacity
                onPress={abrirNovaPublicacao}
                activeOpacity={0.85}
                style={{
                    backgroundColor: '#032551',
                    paddingVertical: 11,
                    paddingHorizontal: 18,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7
                }}
                >
                <CustomIcon name="add" size={17} color="#FFFFFF" />
                    <Text style={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: 13
                    }}>
                        Nova publicação
                    </Text>
            </TouchableOpacity>
        </View>

        {erro && (
            <FeedbackBox tipo="erro" mensagem={erro} onClose={() => setFeedback({ tipo: tipo, mensagem: mensagem })}/>
        )}

        {/* Carregamento */}
        {carregando ? (
            <ActivityIndicator size="large" color="#0754A6" />
        ) : publicacoes.length === 0 ? (

            /* Estado vazio */
            <View style={{
            backgroundColor: '#FFFFFF',
            padding: 35,
            borderRadius: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E2E8F0'
            }}>
            <CustomIcon name="document-text-outline" size={35} color="#94A3B8" />

            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#032551',
                marginTop: 12
            }}>
                Nenhuma publicação ainda
            </Text>

            <Text style={{
                fontSize: 13,
                color: '#64748B',
                marginTop: 5,
                textAlign: 'center'
            }}>
                As publicações cadastradas para seu curso aparecerão aqui.
            </Text>
            </View>

        ) : (

            /* Grade de publicações */
            <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: 14,
            padding: 14,
            flex: 1
            }}>
            {publicacoes.map(publicacao => (
                <View
                key={publicacao.id}
                style={{
                    width: larguraCard,
                    height: 700,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    borderBottomWidth: 4,
                    borderBottomColor: '#FFB900',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                >

                {/* Imagem da publicação */}
                {publicacao.imagem?.caminho_img ? (
                    <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => visualizarImagemOriginal(publicacao)}
                    >
                    <Image
                        source={{ uri: publicacao.imagem.caminho_img }}
                        style={{
                        width: '100%',
                        aspectRatio: 4 / 5,
                        backgroundColor: '#E2E8F0'
                        }}
                        resizeMode="cover"
                    />
                    </TouchableOpacity>
                ) : (
                    <View style={{
                    width: '100%',
                    aspectRatio: 4 / 5,
                    backgroundColor: '#E8EEF5',
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}>
                    <CustomIcon name="image" size={35} color="#94A3B8" />
                    </View>
                )}

                {/* Conteúdo */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: 14,
                        flexGrow: 1,
                        justifyContent: 'space-between'
                    }}
                    showsVerticalScrollIndicator={true}
                >

                    {/* Identificação do curso */}
                    <View style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#E2F1FF',
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginBottom: 10
                    }}>
                    <Text style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#0754A6'
                    }}>
                        {publicacao.curso?.nome || 'Curso'}
                    </Text>
                    </View>

                    {/* Título */}
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: '#032551',
                        marginBottom: 8
                    }}>
                    {publicacao.titulo}
                    </Text>

                    {/* Descrição */}
                    <Text
                    numberOfLines={
                        publicacoesExpandidas.includes(publicacao.id) ? undefined : 3
                    }
                    style={{
                        fontSize: 12,
                        color: '#666666',
                        lineHeight: 18
                    }}
                    >
                    {publicacao.descricao}
                    </Text>

                    {precisaExpandir(publicacao.descricao) && (
                    <TouchableOpacity
                        onPress={() => alternarDescricao(publicacao.id)}
                        style={{ marginTop: 6 }}
                    >
                        <Text style={{
                            color: '#0754A6',
                            fontSize: 12,
                            fontWeight: '600'
                        }}>
                        {publicacoesExpandidas.includes(publicacao.id)
                            ? 'Ver menos'
                            : 'Ver mais'}
                        </Text>
                    </TouchableOpacity>
                    )}

                    {/* Divisor */}
                    <View style={{
                    height: 1,
                    backgroundColor: '#E2E8F0',
                    marginVertical: 12
                    }} />

                    {/* Ações */}
                    <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginTop: 16                    }}>
                    <TouchableOpacity
                        onPress={() => abrirEdicaoPublicacao(publicacao)}
                        activeOpacity={0.8}
                        style={{
                        flex: 1,
                        backgroundColor: '#E2F1FF',
                        paddingVertical: 9,
                        borderRadius: 6,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 6
                        }}
                    >
                        <CustomIcon name="pencil" size={14} color="#0754A6" />
                        <Text style={{
                        color: '#0754A6',
                        fontWeight: 'bold',
                        fontSize: 12
                        }}>
                        Editar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => solicitarExclusao(publicacao)}
                        activeOpacity={0.8}
                        style={{
                        backgroundColor: '#FEECEC',
                        paddingVertical: 9,
                        paddingHorizontal: 13,
                        borderRadius: 6,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 6
                        }}
                    >
                        <CustomIcon name="trash" size={14} color="#DC4545" />
                        <Text style={{
                        color: '#DC4545',
                        fontWeight: 'bold',
                        fontSize: 12
                        }}>
                        Excluir
                        </Text>
                    </TouchableOpacity>
                    </View>

                </ScrollView>

                </View>
                
            ))}
                {/* Destaque amarelo inferior */}
                <View style={{
                    height: 4,
                    backgroundColor: '#FFBF18'
                }} />
            </View>
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
            imagemOriginal={imagemOriginal}
            editorAberto={editorAberto}
            setEditorAberto={setEditorAberto}
            confirmarRecorte={confirmarRecorte}

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
            onCancel={() =>
            setConfirmPopup(prev => ({ ...prev, visible: false }))
            }
        />

        <Modal
            visible={modalImagemOriginal}
            transparent
            animationType="fade"
            onRequestClose={() => setModalImagemOriginal(false)}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>

                <TouchableOpacity
                    onPress={() => setModalImagemOriginal(false)}
                    style={{
                        position: 'absolute',
                        top: 40,
                        right: 20,
                        zIndex: 2,
                        padding: 10
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 'bold'
                    }}>
                        ×
                    </Text>
                </TouchableOpacity>

                {imagemOriginalSelecionada && (
                    <Image
                        source={{ uri: imagemOriginalSelecionada }}
                        style={{
                            width: '100%',
                            height: '80%'
                        }}
                        resizeMode="contain"
                    />
                )}

            </View>
        </Modal>

        </View>
    );
}