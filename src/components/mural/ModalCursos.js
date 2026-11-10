// src/components/mural/ModalCursos.js
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
              <Text style={[modalStyles.subtituloModalHeader, { letterSpacing: 0.5, fontWeight: '700', fontSize: 11 }]}>
                {curso.tipo ? `${curso.tipo} • ` : ''}{curso.modalidade || 'Graduação'}
              </Text>
              <Text style={[modalStyles.tituloModal, { letterSpacing: -0.3, fontSize: 18, marginTop: 2 }]} numberOfLines={2}>
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
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            
            {/* BLOCO 1: APRESENTAÇÃO */}
            <View style={modalStyles.blocoSecao}>
              <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>APRESENTAÇÃO</Text>
              <View style={modalStyles.linhaAmarela} />
              
              <Text style={[modalStyles.textoApresentacao, { lineHeight: 20, color: '#334155', fontSize: 13.5 }]}>
                {curso.descricao || "Nenhuma descrição detalhada informada para este curso até o momento. Consulte o site oficial para mais informações sobre a matriz curricular e ementa."}
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 14, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                <Text style={[modalStyles.textoModalidade, { fontSize: 12, color: '#475569' }]}>
                  📌 <Text style={{ fontWeight: "700", color: '#1E293B' }}>Modalidade:</Text> {curso.modalidade || 'Graduação'}
                </Text>
                {curso.tipo && (
                  <Text style={[modalStyles.textoModalidade, { fontSize: 12, color: '#475569' }]}>
                    🎓 <Text style={{ fontWeight: "700", color: '#1E293B' }}>Ensino:</Text> {curso.tipo}
                  </Text>
                )}
              </View>

              {curso.link ? (
                <TouchableOpacity
                  style={[modalStyles.btnSiteOficial, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16, borderRadius: 8, paddingVertical: 12 }]}
                  onPress={() => Linking.openURL(curso.link)}
                  activeOpacity={0.85}
                >
                  <CustomIcon name="globe-outline" size={18} color="#FFFFFF" />
                  <Text style={[modalStyles.textoBtnSite, { fontWeight: '700', fontSize: 13 }]}>
                    + Informações (Site Oficial)
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 12, color: "#64748B", fontStyle: "italic", marginTop: 12 }}>
                  ℹ️ Site oficial indisponível no momento.
                </Text>
              )}
            </View>

            {/* BLOCO 2: EVENTOS E AVISOS DO CURSO */}
            <View style={modalStyles.blocoSecao}>
              <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>
                EVENTOS E AVISOS DO CURSO
              </Text>
              <View style={modalStyles.linhaAmarela} />

              {curso.eventosPrincipais && curso.eventosPrincipais.length > 0 ? (
                curso.eventosPrincipais.map((ev, index) => (
                  <View key={index} style={[modalStyles.eventoCardModal, { borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }]}>
                    <Text style={modalStyles.tagEventoModal}>
                      {ev.tipo || "Evento"}
                    </Text>
                    <Text
                      style={[modalStyles.tituloEventoModal, { fontWeight: '700', fontSize: 14, color: '#032551' }]}
                      numberOfLines={2}
                    >
                      {ev.titulo}
                    </Text>
                    <Text style={[modalStyles.dataEventoModal, { color: '#64748B', fontSize: 12, marginTop: 4 }]}>
                      📅 {ev.data} {ev.local ? `| 📍 ${ev.local}` : ""}
                    </Text>

                    <TouchableOpacity
                      style={[modalStyles.btnDetalhesModal, { borderRadius: 6, paddingVertical: 8, marginTop: 10 }]}
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
                      <Text style={[modalStyles.textoBtnDetalhesModal, { fontWeight: '600', fontSize: 12 }]}>
                        + Detalhes
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={[modalStyles.textoVazio, { color: '#64748B', fontSize: 13, fontStyle: 'italic' }]}>
                  Nenhum evento ou aviso publicado para este curso no momento.
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
                    const imagemUrl = typeof imagemObj === 'object' ? imagemObj?.caminho_img : imagemObj;
                    const proporcaoCard = imagemObj?.proporcao || '16:9';

                    return (
                      <View
                        key={publicacao.id}
                        style={[
                          modalStyles.publicacaoCard,
                          { width: larguraCardPublicacao, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
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

                        <View style={[modalStyles.conteudoPublicacao, { padding: 12 }]}>
                          <Text style={[modalStyles.tituloPublicacao, { fontWeight: '700', color: '#032551', fontSize: 13.5 }]}>
                            {publicacao.titulo}
                          </Text>

                          <Text
                            numberOfLines={
                              publicacoesExpandidas.includes(publicacao.id) ? undefined : 3
                            }
                            style={[modalStyles.descricaoPublicacao, { color: '#475569', fontSize: 12, lineHeight: 18, marginTop: 4 }]}
                          >
                            {publicacao.descricao}
                          </Text>

                          {precisaExpandir(publicacao.descricao) && (
                            <TouchableOpacity
                              onPress={() => alternarDescricao(publicacao.id)}
                              style={{ marginTop: 6 }}
                            >
                              <Text style={[modalStyles.btnExpandirPublicacao, { fontWeight: '600', fontSize: 11 }]}>
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
                <Text style={[modalStyles.textoVazio, { color: '#64748B', fontSize: 13, fontStyle: 'italic' }]}>
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
                      { padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
                      index > 0 && {
                        marginTop: 15,
                      },
                    ]}
                  >
                    <View style={modalStyles.topoCoordenacao}>
                      <View style={[modalStyles.avatarCoordenacao, { backgroundColor: '#032551' }]}>
                        <CustomIcon name="person-outline" size={18} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[modalStyles.nomeCoordenacao, { fontWeight: '700', color: '#032551', fontSize: 14 }]}>
                          {coord.nome}
                        </Text>
                        <Text style={[modalStyles.descricaoCoordenacao, { color: '#64748B', fontSize: 11.5 }]}>
                          Coordenação de {curso.nome || curso.titulo}
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 10, gap: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 }}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${coord.email}`)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <CustomIcon name="mail-outline" size={14} color="#054ca9" />
                        <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "600" }}>
                          {coord.email}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${coord.telefone}`)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
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
                <View style={[modalStyles.cardCoordenacao, { padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }]}>
                  <View style={modalStyles.topoCoordenacao}>
                    <View style={[modalStyles.avatarCoordenacao, { backgroundColor: '#032551' }]}>
                      <CustomIcon name="school-outline" size={18} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[modalStyles.nomeCoordenacao, { fontWeight: '700', color: '#032551', fontSize: 14 }]}>
                        Coordenação Acadêmica
                      </Text>
                      <Text style={[modalStyles.descricaoCoordenacao, { color: '#64748B', fontSize: 11.5 }]}>
                        Precisa de suporte ou esclarecer dúvidas sobre a matriz curricular?
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[modalStyles.btnContato, { marginTop: 14, borderRadius: 8, paddingVertical: 12 }]}
                    onPress={() =>
                      Linking.openURL(
                        "mailto:coordenacao@estacio.br?subject=Dúvida sobre o curso " +
                          (curso.nome || curso.titulo),
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <CustomIcon name="send-outline" size={15} color="#FFFFFF" />
                    <Text style={[modalStyles.textoBtnContato, { fontWeight: '700', fontSize: 13 }]}>
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