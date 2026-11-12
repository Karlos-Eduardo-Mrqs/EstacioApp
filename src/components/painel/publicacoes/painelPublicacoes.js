import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useGerenciarPublicacoes } from '../../../hooks/useGerenciarPublicacoes';
import { obterAspectRatioNumerico } from '../../../constants/proporcoesConstantes';
import ConfirmPopup from '../../ConfirmPopup';
import CustomIcon from '../../CustomIcon';
import FeedbackBox from '../../FeedPopup';
import ToastPopup from '../../Popup';
import ModalVisualizarImagem from '../../ModalVisualizarImagemCheia';
import ModalGerenciarPublicacao from './modalGerenciarPublicacoes';

export default function PainelPublicacoes({ usuarioAtual }) {
  const {
    publicacoes,
    busca,
    setBusca,
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
  } = useGerenciarPublicacoes(usuarioAtual?.curso_id, usuarioAtual);

  const { width: larguraTela } = useWindowDimensions();
  const larguraCard = larguraTela < 600 ? '100%' : larguraTela < 1000 ? '48%' : '30%';

  const [modalImagemOriginal, setModalImagemOriginal] = useState(false);
  const [imagemOriginalSelecionada, setImagemOriginalSelecionada] = useState(null);

  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  function visualizarImagemOriginal(url) {
    if (!url) return;
    setImagemOriginalSelecionada(url);
    setModalImagemOriginal(true);
  }

  // Verificação flexível do perfil (ignora acentos e maiúsculas/minúsculas)
  // 🔍 VERIFICAÇÃO FLEXÍVEL DO PERFIL
  const perfilNormalizado = usuarioAtual?.perfil ? usuarioAtual.perfil.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  const ehGerencia = perfilNormalizado.includes("gerencia") || perfilNormalizado.includes("admin");

  // SEPARAÇÃO RIGOROSA:
  // Se for Gerência, separa os seus posts/geral dos posts de outros coordenadores
  const publicacoesDaGerencia = ehGerencia 
    ? publicacoes.filter(pub => Number(pub.usuario_id) === Number(usuarioAtual?.id) || !pub.curso_id)
    : [];

  const publicacoesDosCoordenadores = ehGerencia 
    ? publicacoes.filter(pub => Number(pub.usuario_id) !== Number(usuarioAtual?.id) && pub.curso_id)
    : [];

  const publicacoesDoCoordenadorLogado = !ehGerencia
    ? publicacoes.filter(pub => Number(pub.usuario_id) === Number(usuarioAtual?.id))
    : [];

  // Função auxiliar de renderização do card
  const renderizarCardPublicacao = (pub) => {
    const urlImagemCard = typeof pub.imagem === 'object' ? pub.imagem?.caminho_img : pub.imagem;
    const proporcaoCard = pub.imagem?.proporcao || pub.proporcao || '16:9';

    // Identifica se o post é de um coordenador (não é da gerência e tem curso vinculado)
    const ehPostDeCoordenador = Number(pub.usuario_id) !== Number(usuarioAtual?.id) && pub.curso_id;

    // Extrai o nome do coordenador injetado pelo hook
    const nomeCoordenador = pub.usuario?.nome || pub.autor?.nome || 'Coordenador(a)';

    return (
      <View
        key={pub.id}
        style={{
          width: larguraCard,
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          overflow: 'hidden',
          marginBottom: 14,
        }}
      >
        {urlImagemCard ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => visualizarImagemOriginal(urlImagemCard)}
            style={{
              width: '100%',
              aspectRatio: obterAspectRatioNumerico(proporcaoCard),
              backgroundColor: '#E2E8F0',
            }}
          >
            <Image source={{ uri: urlImagemCard }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: '100%',
              height: 160,
              backgroundColor: '#E8EEF5',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CustomIcon name="image-outline" size={35} color="#94A3B8" />
          </View>
        )}

        <View style={{ padding: 14 }}>
          {/* Etiqueta com o nome do coordenador quando aplicável */}
          {ehPostDeCoordenador && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginBottom: 8,
                backgroundColor: '#F1F5F9',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                alignSelf: 'flex-start',
              }}
            >
              <CustomIcon name="person-outline" size={12} color="#059669" />
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#059669' }}>{nomeCoordenador}</Text>
            </View>
          )}

          <Text style={{ fontSize: 15, fontWeight: '700', color: '#032551', marginBottom: 6 }}>{pub.titulo}</Text>
          <Text numberOfLines={3} style={{ fontSize: 13, color: '#666666', lineHeight: 18, marginBottom: 12 }}>
            {pub.descricao}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              borderTopWidth: 1,
              borderTopColor: '#E2E8F0',
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => abrirEdicaoPublicacao(pub)}
              style={{
                backgroundColor: '#E2F1FF',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <CustomIcon name="pencil" size={14} color="#0754A6" />
              <Text style={{ color: '#0754A6', fontWeight: 'bold', fontSize: 12 }}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setConfirmPopup({
                  visible: true,
                  titulo: 'Excluir publicação',
                  mensagem: `Deseja realmente excluir "${pub.titulo}"?`,
                  tipo: 'danger',
                  onConfirm: async () => {
                    await excluirPublicacao(pub);
                    setConfirmPopup((prev) => ({ ...prev, visible: false }));
                  },
                });
              }}
              style={{
                backgroundColor: '#FEECEC',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <CustomIcon name="trash" size={14} color="#DC4545" />
              <Text style={{ color: '#DC4545', fontWeight: 'bold', fontSize: 12 }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 20, padding: 20, backgroundColor: '#F4F6F8', borderRadius: 12, flex: 1 }}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#032551' }}>
            {ehGerencia ? 'Mural de Publicações Gerais e dos Cursos' : 'Publicações do curso'}
          </Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
            {ehGerencia
              ? 'Visualize comunicados institucionais e submetidos pelos coordenadores.'
              : 'Gerencie os avisos e comunicados do seu curso.'}
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
            gap: 7,
          }}
        >
          <CustomIcon name="add" size={17} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }}>Nova publicação</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Busca */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#CBD5E1',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 16,
          gap: 8,
        }}
      >
        <CustomIcon name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={{ flex: 1, fontSize: 14, color: '#0F172A', padding: 0 }}
          placeholder="Pesquisar publicações por título ou descrição..."
          placeholderTextColor="#94A3B8"
          value={busca}
          onChangeText={setBusca}
        />
        {busca ? (
          <TouchableOpacity onPress={() => setBusca('')}>
            <CustomIcon name="info" size={16} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {erro && <FeedbackBox tipo="erro" mensagem={erro} onClose={() => {}} />}

      {carregando ? (
        <ActivityIndicator size="large" color="#0754A6" style={{ marginTop: 40 }} />
      ) : publicacoes.length === 0 ? (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 35,
            borderRadius: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E2E8F0',
          }}
        >
          <CustomIcon name="document-text-outline" size={35} color="#94A3B8" />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#032551', marginTop: 12 }}>
            {busca ? 'Nenhum resultado encontrado' : 'Nenhuma publicação ainda'}
          </Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 5, textAlign: 'center' }}>
            {busca
              ? 'Tente pesquisar com outras palavras-chave.'
              : 'As publicações cadastradas aparecerão aqui.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {/* SEÇÃO 1: PUBLICAÇÕES DA GERÊNCIA */}
          {ehGerencia && (
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#CBD5E1',
                  paddingBottom: 6,
                }}
              >
                <CustomIcon name="shield-checkmark-outline" size={18} color="#173EA5" />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>
                  Publicações da Gerência ({publicacoesDaGerencia.length})
                </Text>
              </View>

              {publicacoesDaGerencia.length === 0 ? (
                <Text style={{ fontSize: 13, color: '#64748B', fontStyle: 'italic', marginBottom: 10 }}>
                  Nenhuma publicação da gerência encontrada.
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                  {publicacoesDaGerencia.map(renderizarCardPublicacao)}
                </View>
              )}
            </View>
          )}

          {/* SEÇÃO 2: PUBLICAÇÕES DOS COORDENADORES */}
          {ehGerencia && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#CBD5E1',
                  paddingBottom: 6,
                }}
              >
                <CustomIcon name="school-outline" size={18} color="#059669" />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>
                  Publicações dos Coordenadores ({publicacoesDosCoordenadores.length})
                </Text>
              </View>

              {publicacoesDosCoordenadores.length === 0 ? (
                <Text style={{ fontSize: 13, color: '#64748B', fontStyle: 'italic' }}>
                  Nenhuma publicação de coordenadores encontrada.
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                  {publicacoesDosCoordenadores.map(renderizarCardPublicacao)}
                </View>
              )}
            </View>
          )}

          {/* Lista padrão quando o acesso for de Coordenador */}
          {!ehGerencia && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
              {publicacoesDoCoordenadorLogado.length === 0 ? (
                <Text style={{ fontSize: 13, color: '#64748B', fontStyle: 'italic' }}>Nenhuma publicação criada por você ainda.</Text>
              ) : (
                publicacoesDoCoordenadorLogado.map(renderizarCardPublicacao)
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Modais e Popups */}
      <ModalGerenciarPublicacao
        visible={modalPublicacao}
        onClose={() => setModalPublicacao(false)}
        publicacaoEditando={publicacaoEditando}
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        imagem={imagem}
        proporcao={proporcao}
        setProporcao={setProporcao}
        selecionarImagem={selecionarImagem}
        removerImagem={removerImagem}
        salvarPublicacao={salvarPublicacao}
        carregando={carregando}
        carregandoImagem={carregandoImagem}
      />

      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup((prev) => ({ ...prev, visible: false }))}
      />

      <ToastPopup
        visible={toast.visible}
        titulo={toast.titulo}
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <ModalVisualizarImagem
        visible={modalImagemOriginal}
        imageUrl={imagemOriginalSelecionada}
        onClose={() => setModalImagemOriginal(false)}
      />
    </View>
  );
}