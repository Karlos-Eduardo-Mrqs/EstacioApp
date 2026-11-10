import { useState, useEffect } from "react";
import { Linking, Modal, ScrollView, Text, TouchableOpacity, View, useWindowDimensions, Platform, Image, ActivityIndicator } from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon"; 
import BotaoFechar from "../BotaoFechar";
import ModalVisualizarImagem from "../ModalVisualizarImagemCheia";
import { buscarPublicacoesDoCurso } from "../../services/publicacaoServices";
import { obterAspectRatioNumerico } from "../../constants/proporcoesConstantes";

export default function ModalCurso({ curso, onClose, onSelectEvento }) {
  const { width } = useWindowDimensions();
  const larguraCardPublicacao = width < 600 ? 260 : 300;

  // Estados locais para gerenciar as publicações e o zoom de imagem no modal
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregandoPublicacoes, setCarregandoPublicacoes] = useState(false);
  const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  useEffect(() => {
    if (curso?.id) {
      carregarPublicacoesDoCurso(curso.id);
    } else {
      setPublicacoes([]);
    }
  }, [curso]);

  async function carregarPublicacoesDoCurso(cursoId) {
    try {
      setCarregandoPublicacoes(true);
      const dados = await buscarPublicacoesDoCurso(cursoId);
      setPublicacoes(dados || []);
    } catch (err) {
      console.error("Erro ao carregar publicações do curso:", err);
      setPublicacoes([]);
    } finally {
      setCarregandoPublicacoes(false);
    }
  }

  function alternarDescricao(id) {
    setPublicacoesExpandidas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function precisaExpandir(texto) {
    return texto && texto.length > 120;
  }

  if (!curso) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalConteudo}>
          
          {/* CABEÇALHO DO MODAL */}
          <View style={modalStyles.cabecalhoModal}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={modalStyles.subtituloModalHeader}>
                {curso.tipo ? `${curso.tipo} • ` : ''}{curso.modalidade || 'Graduação'}
              </Text>
              <Text style={modalStyles.tituloModal} numberOfLines={2}>
                {curso.nome || curso.titulo}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.btnFechar} activeOpacity={0.8}>
              <BotaoFechar onPress={onClose} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={modalStyles.corpoModalScroll}
          >
            
            {/* BLOCO 1: APRESENTAÇÃO */}
            <View style={modalStyles.blocoSecao}>
              <Text style={modalStyles.tituloBlocoSecao}>APRESENTAÇÃO</Text>
              <View style={modalStyles.linhaAmarela} />
              
              <Text style={modalStyles.textoApresentacao}>
                {curso.descricao || "Nenhuma descrição detalhada informada para este curso até o momento. Consulte o site oficial para mais informações sobre a matriz curricular e ementa."}
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                <Text style={modalStyles.textoModalidade}>
                  📌 <Text style={{ fontWeight: "bold" }}>Modalidade:</Text> {curso.modalidade || 'Graduação'}
                </Text>
                {curso.tipo && (
                  <Text style={modalStyles.textoModalidade}>
                    🎓 <Text style={{ fontWeight: "bold" }}>Ensino:</Text> {curso.tipo}
                  </Text>
                )}
              </View>

              {curso.link ? (
                <TouchableOpacity
                  style={[modalStyles.btnSiteOficial, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }]}
                  onPress={() => Linking.openURL(curso.link)}
                  activeOpacity={0.85}
                >
                  <CustomIcon name="globe-outline" size={18} color="#FFFFFF" />
                  <Text style={modalStyles.textoBtnSite}>
                    + Informações (Site Oficial)
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 12, color: "#888", fontStyle: "italic", marginTop: 10 }}>
                  ℹ️ Site oficial indisponível no momento.
                </Text>
              )}
            </View>

            {/* BLOCO 2: EVENTOS E AVISOS DO CURSO */}
            <View style={modalStyles.blocoSecao}>
              <Text style={modalStyles.tituloBlocoSecao}>
                EVENTOS E AVISOS DO CURSO
              </Text>
              <View style={modalStyles.linhaAmarela} />

              {curso.eventosPrincipais && curso.eventosPrincipais.length > 0 ? (
                curso.eventosPrincipais.map((ev, index) => (
                  <View key={index} style={modalStyles.eventoCardModal}>
                    <Text style={modalStyles.tagEventoModal}>
                      {ev.tipo || "Evento"}
                    </Text>
                    <Text
                      style={modalStyles.tituloEventoModal}
                      numberOfLines={2}
                    >
                      {ev.titulo}
                    </Text>
                    <Text style={modalStyles.dataEventoModal}>
                      📅 {ev.data} {ev.local ? `| 📍 ${ev.local}` : ""}
                    </Text>

                    <TouchableOpacity
                      style={modalStyles.btnDetalhesModal}
                      onPress={() => {
                        onClose();
                        onSelectEvento({
                          id: `curso-ev-${index}`,
                          titulo: ev.titulo,
                          tipo: ev.tipo || "Evento",
                          dia: ev.data,
                          local: ev.local || curso.nome,
                          turma: curso.nome,
                          autor: `Coordenação de ${curso.nome}`,
                          descricao:
                            ev.descricao ||
                            `Evento oficial vinculado ao curso de ${curso.nome}.`,
                          horas_acc: 10,
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={modalStyles.textoBtnDetalhesModal}>
                        + Detalhes
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={modalStyles.textoVazio}>
                  Nenhum evento ou aviso publicado para este curso no momento.
                </Text>
              )}
            </View>

           {/* BLOCO 3: PUBLICAÇÕES DO CURSO */}
            <View style={modalStyles.blocoSecao}>
              <Text style={modalStyles.tituloBlocoSecao}>
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
                    const imagemUrl = typeof imagemObj === 'object' ? imagemObj?.caminho_img : imagemObj;
                    const proporcaoCard = imagemObj?.proporcao || '16:9';

                    return (
                      <View
                        key={publicacao.id}
                        style={[
                          modalStyles.publicacaoCard,
                          { width: larguraCardPublicacao },
                        ]}
                      >
                        {imagemUrl ? (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => setImagemSelecionada(imagemUrl)}
                            style={{ width: "100%", aspectRatio: obterAspectRatioNumerico(proporcaoCard), backgroundColor: "#E2E8F0" }}
                          >
                            <Image
                              source={{ uri: imagemUrl }}
                              style={modalStyles.imagemPublicacao}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={modalStyles.imagemPublicacaoVazia}>
                            <CustomIcon
                              name="image-outline"
                              size={30}
                              color="#999"
                            />
                          </View>
                        )}

                        <View style={modalStyles.conteudoPublicacao}>
                          <Text style={modalStyles.tituloPublicacao}>
                            {publicacao.titulo}
                          </Text>

                          <Text
                            numberOfLines={
                              publicacoesExpandidas.includes(publicacao.id) ? undefined : 3
                            }
                            style={modalStyles.descricaoPublicacao}
                          >
                            {publicacao.descricao}
                          </Text>

                          {precisaExpandir(publicacao.descricao) && (
                            <TouchableOpacity
                              onPress={() => alternarDescricao(publicacao.id)}
                              style={{ marginTop: 6 }}
                            >
                              <Text style={modalStyles.btnExpandirPublicacao}>
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
                <Text style={modalStyles.textoVazio}>
                  Nenhuma publicação disponível para este curso.
                </Text>
              )}
            </View>

            {/* BLOCO 4: FALE COM A COORDENAÇÃO */}
            <View style={modalStyles.blocoSecao}>
              <Text style={modalStyles.tituloBlocoSecao}>
                FALE COM A COORDENAÇÃO
              </Text>
              <View style={modalStyles.linhaAmarela} />

              {curso.coordenadores && curso.coordenadores.length > 0 ? (
                curso.coordenadores.map((coord, index) => (
                  <View
                    key={index}
                    style={[
                      modalStyles.cardCoordenacao,
                      index > 0 && {
                        marginTop: 15,
                        paddingTop: 15,
                        borderTopWidth: 1,
                        borderTopColor: "#eee",
                      },
                    ]}
                  >
                    <View style={modalStyles.topoCoordenacao}>
                      <View style={modalStyles.avatarCoordenacao}>
                        <CustomIcon name="person-outline" size={18} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={modalStyles.nomeCoordenacao}>
                          {coord.nome}
                        </Text>
                        <Text style={modalStyles.descricaoCoordenacao}>
                          Coordenação de {curso.nome || curso.titulo}
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 8, gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${coord.email}`)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <CustomIcon name="mail-outline" size={14} color="#054ca9" />
                        <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "bold" }}>
                          {coord.email}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${coord.telefone}`)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <CustomIcon name="phone-portrait-outline" size={14} color="#054ca9" />
                        <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "bold" }}>
                          {coord.telefone}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={modalStyles.cardCoordenacao}>
                  <View style={modalStyles.topoCoordenacao}>
                    <View style={modalStyles.avatarCoordenacao}>
                      <CustomIcon name="school-outline" size={18} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={modalStyles.nomeCoordenacao}>
                        Coordenação Acadêmica
                      </Text>
                      <Text style={modalStyles.descricaoCoordenacao}>
                        Precisa de suporte ou esclarecer dúvidas sobre a matriz curricular?
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[modalStyles.btnContato, { marginTop: 10 }]}
                    onPress={() =>
                      Linking.openURL(
                        "mailto:coordenacao@estacio.br?subject=Dúvida sobre o curso " +
                          (curso.nome || curso.titulo),
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <CustomIcon name="send-outline" size={14} color="#FFFFFF" />
                    <Text style={modalStyles.textoBtnContato}>
                      Enviar E-mail para Coordenação
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </ScrollView>
          
          {/* Utilizando o componente reutilizável de imagem em tela cheia */}
          <ModalVisualizarImagem
            visible={!!imagemSelecionada}
            imageUrl={imagemSelecionada}
            onClose={() => setImagemSelecionada(null)}
          />

        </View>
      </View>
    </Modal>
  );
}