import { useState } from 'react';
import {ActivityIndicator,Image,ScrollView,Text,TouchableOpacity,useWindowDimensions,View} from 'react-native';
import { useGerenciarPublicacoes } from '../../../hooks/useGerenciarPublicacoes'; 
import { obterAspectRatioNumerico } from '../../../constants/proporcoesConstantes';
import ConfirmPopup from '../../ConfirmPopup';
import CustomIcon from '../../CustomIcon'; 
import FeedbackBox from '../../FeedPopup'; 
import ToastPopup from "../../Popup";
import ModalVisualizarImagem from '../../ModalVisualizarImagemCheia'; // 👈 Importando o componente isolado
import ModalGerenciarPublicacao from './modalGerenciarPublicacoes'; 

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
    setToast
  } = useGerenciarPublicacoes(usuarioAtual?.curso_id, usuarioAtual);

  const { width: larguraTela } = useWindowDimensions();
  const larguraCard = larguraTela < 600 ? "100%" : larguraTela < 1000 ? "48%" : "30%";
  
  const [modalImagemOriginal, setModalImagemOriginal] = useState(false);
  const [imagemOriginalSelecionada, setImagemOriginalSelecionada] = useState(null);

  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
    onConfirm: null,
    tipo: "danger",
  });

  function visualizarImagemOriginal(url) {
    if (!url) return;
    setImagemOriginalSelecionada(url);
    setModalImagemOriginal(true);
  }

  return (
    <View style={{ marginTop: 20, padding: 20, backgroundColor: "#F4F6F8", borderRadius: 12, flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#032551" }}>
            Publicações do curso
          </Text>
          <Text style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
            Gerencie os avisos e comunicados do seu curso.
          </Text>
        </View>

        <TouchableOpacity
          onPress={abrirNovaPublicacao}
          activeOpacity={0.85}
          style={{
            backgroundColor: "#032551",
            paddingVertical: 11,
            paddingHorizontal: 18,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
          }}
        >
          <CustomIcon name="add" size={17} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 13 }}>
            Nova publicação
          </Text>
        </TouchableOpacity>
      </View>

      {erro && <FeedbackBox tipo="erro" mensagem={erro} onClose={() => {}} />}

      {carregando ? (
        <ActivityIndicator size="large" color="#0754A6" style={{ marginTop: 40 }} />
      ) : publicacoes.length === 0 ? (
        <View style={{ backgroundColor: "#FFFFFF", padding: 35, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" }}>
          <CustomIcon name="document-text-outline" size={35} color="#94A3B8" />
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#032551", marginTop: 12 }}>
            Nenhuma publicação ainda
          </Text>
          <Text style={{ fontSize: 13, color: "#64748B", marginTop: 5, textAlign: "center" }}>
            As publicações cadastradas para seu curso aparecerão aqui.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 14, paddingBottom: 20 }}>
          {publicacoes.map((pub) => {
            const urlImagemCard = typeof pub.imagem === 'object' ? pub.imagem?.caminho_img : pub.imagem;
            const proporcaoCard = pub.imagem?.proporcao || pub.proporcao || '16:9';

            return (
              <View
                key={pub.id}
                style={{
                  width: larguraCard,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  overflow: "hidden",
                  marginBottom: 14,
                }}
              >
                {urlImagemCard ? (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => visualizarImagemOriginal(urlImagemCard)}
                    style={{ width: "100%", aspectRatio: obterAspectRatioNumerico(proporcaoCard), backgroundColor: "#E2E8F0" }}
                  >
                    <Image
                      source={{ uri: urlImagemCard }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: "100%", height: 160, backgroundColor: "#E8EEF5", justifyContent: "center", alignItems: "center" }}>
                    <CustomIcon name="image-outline" size={35} color="#94A3B8" />
                  </View>
                )}

                <View style={{ padding: 14 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: "#032551", marginBottom: 6 }}>
                    {pub.titulo}
                  </Text>
                  <Text numberOfLines={3} style={{ fontSize: 13, color: "#666666", lineHeight: 18, marginBottom: 12 }}>
                    {pub.descricao}
                  </Text>

                  <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, borderTopWidth: 1, borderTopColor: "#E2E8F0", paddingTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => abrirEdicaoPublicacao(pub)}
                      style={{ backgroundColor: "#E2F1FF", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 4 }}
                    >
                      <CustomIcon name="pencil" size={14} color="#0754A6" />
                      <Text style={{ color: "#0754A6", fontWeight: "bold", fontSize: 12 }}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setConfirmPopup({
                          visible: true,
                          titulo: "Excluir publicação",
                          mensagem: `Deseja realmente excluir "${pub.titulo}"?`,
                          tipo: "danger",
                          onConfirm: async () => {
                            await excluirPublicacao(pub);
                            setConfirmPopup((prev) => ({ ...prev, visible: false }));
                          },
                        });
                      }}
                      style={{ backgroundColor: "#FEECEC", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 4 }}
                    >
                      <CustomIcon name="trash" size={14} color="#DC4545" />
                      <Text style={{ color: "#DC4545", fontWeight: "bold", fontSize: 12 }}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Modal de Gerenciamento (Criar/Editar) */}
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

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup((prev) => ({ ...prev, visible: false }))}
      />

      {/* Toast Popup de Feedback */}
      <ToastPopup
        visible={toast.visible}
        titulo={toast.titulo}
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* 🟢 Utilizando o componente reutilizável de imagem em tela cheia */}
      <ModalVisualizarImagem
        visible={modalImagemOriginal}
        imageUrl={imagemOriginalSelecionada}
        onClose={() => setModalImagemOriginal(false)}
      />
    </View>
  );
}