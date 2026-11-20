import { useState, useEffect, useCallback } from "react";
import {Linking,Modal,ScrollView,Text,TouchableOpacity,View,useWindowDimensions,Image,ActivityIndicator,} from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon";
import BotaoFechar from "../BotaoFechar";
import ModalVisualizarImagem from "../ModalVisualizarImagemCheia";
import LeituraPopup from "../leituraPopup";
import { buscarPublicacoesEAvisosDoCurso } from "../../services/publicacaoServices";
import { obterAspectRatioNumerico } from "../../constants/proporcoesConstantes";

export default function ModalCurso({ curso, onClose, onSelectEvento }) {
  const { width } = useWindowDimensions();
  const larguraCardPublicacao = width < 600 ? 260 : 300;

  const [publicacoes, setPublicacoes] = useState([]);
  const [avisosCurso, setAvisosCurso] = useState([]);
  const [coordenadorCurso, setCoordenadorCurso] = useState(null);
  const [carregandoPublicacoes, setCarregandoPublicacoes] = useState(false);
  const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [avisoSelecionado, setAvisoSelecionado] = useState(null);

  const carregarDadosDoCurso = useCallback(async (cursoId) => {
    try {
      setCarregandoPublicacoes(true);
      const { posts, avisos, coordenador } = await buscarPublicacoesEAvisosDoCurso(cursoId);
      setPublicacoes(posts || []);
      setAvisosCurso(avisos || []);
      setCoordenadorCurso(coordenador || null);
    } catch (err) {
      console.error("Erro ao carregar dados do curso:", err);
      setPublicacoes([]);
      setAvisosCurso([]);
      setCoordenadorCurso(null);
    } finally {
      setCarregandoPublicacoes(false);
    }
  }, []);

  useEffect(() => {
    if (curso?.id) {
      carregarDadosDoCurso(curso.id);
    } else {
      setPublicacoes([]);
      setAvisosCurso([]);
      setCoordenadorCurso(null);
    }
  }, [curso, carregarDadosDoCurso]);

  function alternarDescricao(id) {
    setPublicacoesExpandidas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function precisaExpandir(texto) {
    return texto && texto.length > 120;
  }

  if (!curso) return null;

  const emailCoordenacao =
    coordenadorCurso?.email ||
    curso.coordenadores?.[0]?.email ||
    "coordenacao@estacio.br";

  const nomeCoordenacao =
    coordenadorCurso?.nome ||
    curso.coordenadores?.[0]?.nome ||
    "Coordenação Acadêmica";

  const subModalAberto = Boolean(imagemSelecionada || avisoSelecionado);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={!subModalAberto}
        onRequestClose={onClose}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalConteudo}>
            {/* CABEÇALHO DO MODAL */}
            <View style={modalStyles.cabecalhoModal}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={[
                    modalStyles.subtituloModalHeader,
                    { letterSpacing: 0.5, fontWeight: "700", fontSize: 11 },
                  ]}
                >
                  {curso.tipo ? `${curso.tipo} • ` : ""}
                  {curso.modalidade || "Graduação"}
                </Text>
                <Text
                  style={[
                    modalStyles.tituloModal,
                    { letterSpacing: -0.3, fontSize: 18, marginTop: 2 },
                  ]}
                  numberOfLines={2}
                >
                  {curso.nome || curso.titulo}
                </Text>
              </View>

              <BotaoFechar onPress={onClose} style={modalStyles.btnFechar} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={modalStyles.corpoModalScroll}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* BLOCO 1: APRESENTAÇÃO */}
              <View style={modalStyles.blocoSecao}>
                <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>
                  APRESENTAÇÃO
                </Text>
                <View style={modalStyles.linhaAmarela} />

                <Text
                  style={[
                    modalStyles.textoApresentacao,
                    { lineHeight: 20, color: "#334155", fontSize: 13.5 },
                  ]}
                >
                  {curso.descricao ||
                    "Nenhuma descrição detalhada informada para este curso até o momento. Consulte o site oficial para mais informações sobre a matriz curricular e ementa."}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 16,
                    marginTop: 14,
                    backgroundColor: "#F8FAFC",
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <Text style={[modalStyles.textoModalidade, { fontSize: 12, color: "#475569" }]}>
                    📌 <Text style={{ fontWeight: "700", color: "#1E293B" }}>Modalidade:</Text>{" "}
                    {curso.modalidade || "Graduação"}
                  </Text>
                  {curso.tipo && (
                    <Text style={[modalStyles.textoModalidade, { fontSize: 12, color: "#475569" }]}>
                      🎓 <Text style={{ fontWeight: "700", color: "#1E293B" }}>Ensino:</Text>{" "}
                      {curso.tipo}
                    </Text>
                  )}
                </View>

                {curso.link ? (
                  <TouchableOpacity
                    style={[
                      modalStyles.btnSiteOficial,
                      {
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 16,
                        borderRadius: 8,
                        paddingVertical: 12,
                      },
                    ]}
                    onPress={() => Linking.openURL(curso.link)}
                    activeOpacity={0.85}
                  >
                    <CustomIcon name="globe-outline" size={18} color="#FFFFFF" />
                    <Text style={[modalStyles.textoBtnSite, { fontWeight: "700", fontSize: 13 }]}>
                      + Informações no site oficial
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#64748B",
                      fontStyle: "italic",
                      marginTop: 12,
                    }}
                  >
                    ℹ️ Site oficial indisponível no momento.
                  </Text>
                )}
              </View>

              {/* BLOCO DE AVISOS ATIVOS DO CURSO */}
              <View
                style={[
                  modalStyles.blocoSecao,
                  {
                    backgroundColor: "#FFFBEB",
                    borderColor: "#FDE68A",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 15,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <CustomIcon name="information-circle-outline" size={20} color="#B45309" />
                  <Text
                    style={[modalStyles.tituloBlocoSecao, { color: "#B45309", marginBottom: 0 }]}
                  >
                    AVISOS E COMUNICADOS RECENTES
                  </Text>
                </View>
                <View style={[modalStyles.linhaAmarela, { backgroundColor: "#F59E0B", marginBottom: 10 }]} />

                {avisosCurso.length > 0 ? (
                  avisosCurso.map((aviso, idx) => (
                    <TouchableOpacity
                      key={aviso.id || idx}
                      style={{
                        marginBottom: idx < avisosCurso.length - 1 ? 12 : 0,
                        paddingBottom: idx < avisosCurso.length - 1 ? 12 : 0,
                        borderBottomWidth: idx < avisosCurso.length - 1 ? 1 : 0,
                        borderBottomColor: "#FEF3C7",
                      }}
                      onPress={() => setAvisoSelecionado(aviso)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text
                            style={{
                              fontWeight: "700",
                              fontSize: 13.5,
                              color: "#92400E",
                              marginBottom: 3,
                            }}
                          >
                            {aviso.titulo}
                          </Text>
                          <Text
                            style={{ fontSize: 12.5, color: "#78350F", lineHeight: 18 }}
                            numberOfLines={2}
                          >
                            {aviso.mensagem}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#B45309" }}>
                          Ler 👆
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={{
                      fontSize: 12.5,
                      color: "#92400E",
                      fontStyle: "italic",
                      textAlign: "center",
                      paddingVertical: 4,
                    }}
                  >
                    Não há avisos ou comunicados para este curso no momento.
                  </Text>
                )}
              </View>

              {/* BLOCO 3: PUBLICAÇÕES DO CURSO */}
              <View style={modalStyles.blocoSecao}>
                <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>
                  PUBLICAÇÕES DO CURSO
                </Text>
                <View style={modalStyles.linhaAmarela} />

                {carregandoPublicacoes ? (
                  <ActivityIndicator
                    size="small"
                    color="#173EA5"
                    style={{ marginVertical: 20 }}
                  />
                ) : publicacoes.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    contentContainerStyle={modalStyles.listaPublicacoes}
                  >
                    {publicacoes.map((publicacao) => {
                      const imagemObj = publicacao.imagem;
                      const imagemUrl =
                        typeof imagemObj === "object" ? imagemObj?.caminho_img : imagemObj;
                      const proporcaoCard = imagemObj?.proporcao || "16:9";

                      return (
                        <View
                          key={publicacao.id}
                          style={[
                            modalStyles.publicacaoCard,
                            {
                              width: larguraCardPublicacao,
                              borderRadius: 10,
                              overflow: "hidden",
                              borderWidth: 1,
                              borderColor: "#E2E8F0",
                            },
                          ]}
                        >
                          {imagemUrl ? (
                            <TouchableOpacity
                              activeOpacity={0.9}
                              onPress={() => setImagemSelecionada(imagemUrl)}
                              style={{
                                width: "100%",
                                aspectRatio: obterAspectRatioNumerico(proporcaoCard),
                                backgroundColor: "#E2E8F0",
                              }}
                            >
                              <Image
                                source={{ uri: imagemUrl }}
                                style={modalStyles.imagemPublicacao}
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          ) : (
                            <View style={modalStyles.imagemPublicacaoVazia}>
                              <CustomIcon name="image-outline" size={30} color="#999" />
                            </View>
                          )}

                          <View style={[modalStyles.conteudoPublicacao, { padding: 12 }]}>
                            <Text
                              style={[
                                modalStyles.tituloPublicacao,
                                { fontWeight: "700", color: "#032551", fontSize: 13.5 },
                              ]}
                            >
                              {publicacao.titulo}
                            </Text>

                            <Text
                              numberOfLines={
                                publicacoesExpandidas.includes(publicacao.id) ? undefined : 3
                              }
                              style={[
                                modalStyles.descricaoPublicacao,
                                { color: "#475569", fontSize: 12, lineHeight: 18, marginTop: 4 },
                              ]}
                            >
                              {publicacao.descricao}
                            </Text>

                            {precisaExpandir(publicacao.descricao) && (
                              <TouchableOpacity
                                onPress={() => alternarDescricao(publicacao.id)}
                                style={{ marginTop: 6 }}
                              >
                                <Text
                                  style={[
                                    modalStyles.btnExpandirPublicacao,
                                    { fontWeight: "600", fontSize: 11 },
                                  ]}
                                >
                                  {publicacoesExpandidas.includes(publicacao.id)
                                    ? "Ver menos"
                                    : "Ver mais"}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <Text
                    style={[
                      modalStyles.textoVazio,
                      { color: "#64748B", fontSize: 13, fontStyle: "italic" },
                    ]}
                  >
                    Nenhuma publicação disponível para este curso.
                  </Text>
                )}
              </View>

              {/* BLOCO 4: FALE COM A COORDENAÇÃO */}
              <View style={modalStyles.blocoSecao}>
                <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>
                  FALE COM A COORDENAÇÃO
                </Text>
                <View style={modalStyles.linhaAmarela} />

                {curso.coordenadores && curso.coordenadores.length > 0 ? (
                  curso.coordenadores.map((coord, index) => (
                    <View
                      key={index}
                      style={[
                        modalStyles.cardCoordenacao,
                        {
                          padding: 14,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#E2E8F0",
                          backgroundColor: "#FFFFFF",
                        },
                        index > 0 && { marginTop: 15 },
                      ]}
                    >
                      <View style={modalStyles.topoCoordenacao}>
                        <View
                          style={[modalStyles.avatarCoordenacao, { backgroundColor: "#032551" }]}
                        >
                          <CustomIcon name="person-outline" size={18} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              modalStyles.nomeCoordenacao,
                              { fontWeight: "700", color: "#032551", fontSize: 14 },
                            ]}
                          >
                            {coord.nome}
                          </Text>
                          <Text
                            style={[
                              modalStyles.descricaoCoordenacao,
                              { color: "#64748B", fontSize: 11.5 },
                            ]}
                          >
                            Coordenação de {curso.nome || curso.titulo}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          gap: 6,
                          borderTopWidth: 1,
                          borderTopColor: "#F1F5F9",
                          paddingTop: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`mailto:${coord.email}`)}
                          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                        >
                          <CustomIcon name="mail-outline" size={14} color="#054ca9" />
                          <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "600" }}>
                            {coord.email}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${coord.telefone}`)}
                          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                        >
                          <CustomIcon name="phone-portrait-outline" size={14} color="#054ca9" />
                          <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "600" }}>
                            {coord.telefone}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View
                    style={[
                      modalStyles.cardCoordenacao,
                      {
                        padding: 16,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                        backgroundColor: "#FFFFFF",
                      },
                    ]}
                  >
                    <View style={modalStyles.topoCoordenacao}>
                      <View style={[modalStyles.avatarCoordenacao, { backgroundColor: "#032551" }]}>
                        <CustomIcon name="school-outline" size={18} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            modalStyles.nomeCoordenacao,
                            { fontWeight: "700", color: "#032551", fontSize: 14 },
                          ]}
                        >
                          {nomeCoordenacao} ({emailCoordenacao})
                        </Text>
                        <Text
                          style={[
                            modalStyles.descricaoCoordenacao,
                            { color: "#64748B", fontSize: 11.5 },
                          ]}
                        >
                          Precisa de suporte ou esclarecer dúvidas sobre a matriz curricular?
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        modalStyles.btnContato,
                        { marginTop: 14, borderRadius: 8, paddingVertical: 12 },
                      ]}
                      onPress={() =>
                        Linking.openURL(
                          `mailto:${emailCoordenacao}?subject=Dúvida sobre o curso ` +
                            (curso.nome || curso.titulo)
                        )
                      }
                      activeOpacity={0.8}
                    >
                      <CustomIcon name="send-outline" size={15} color="#FFFFFF" />
                      <Text style={[modalStyles.textoBtnContato, { fontWeight: "700", fontSize: 13 }]}>
                        Enviar E-mail
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ModalVisualizarImagem
        visible={Boolean(imagemSelecionada)}
        imageUrl={imagemSelecionada}
        onClose={() => setImagemSelecionada(null)}
      />

      <LeituraPopup
        aviso={avisoSelecionado}
        visible={Boolean(avisoSelecionado)}
        onClose={() => setAvisoSelecionado(null)}
      />
    </>
  );
}