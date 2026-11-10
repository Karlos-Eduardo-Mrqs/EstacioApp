import React, { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";

import { buscarPublicacoesDoCurso } from "../../services/publicacaoServices";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon"; 
import { CoresInstitucionais } from "../../styles/theme";

export default function ModalCurso({ curso, onClose, onSelectEvento }) {
  // Deteção correta do ecrã para alternar o ícone de fechar
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const larguraCardPublicacao = isDesktop ? (width - 84) / 4 : width * 0.78;
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregandoPublicacoes, setCarregandoPublicacoes] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);

  const precisaExpandir = (descricao) => {
    if (!descricao) return false;

    const linhas = descricao.split('\n');

    return descricao.length > 100 || linhas.length > 3;
  };

  const alternarDescricao = (id) => {
    setPublicacoesExpandidas((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    if (!curso?.id) return;

    async function carregarPublicacoes() {
      try {
        setCarregandoPublicacoes(true);

        const dados = await buscarPublicacoesDoCurso(curso.id);
        setPublicacoes(dados);
      } catch (error) {
        console.error("Erro ao carregar publicações do curso:", error);
        setPublicacoes([]);
      } finally {
        setCarregandoPublicacoes(false);
      }
    }

    carregarPublicacoes();
  }, [curso?.id]);

  if (!curso) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalConteudo}>
          {/* CABEÇALHO DO MODAL */}
          <View style={modalStyles.cabecalhoModal}>
            <View style={{ flex: 1 }}>
              <Text style={modalStyles.subtituloModalHeader}>
                Graduação / Curso
              </Text>
              <Text style={modalStyles.tituloModal}>{curso.titulo}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.btnFechar}>
              <CustomIcon 
                  name={isDesktop ? "close" : "arrow-back"} 
                  size={22} 
                  color={CoresInstitucionais.brancoPuro} 
              />
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
                {curso.descricao}
              </Text>
              <Text style={modalStyles.textoModalidade}>
                📌 <Text style={{ fontWeight: "bold" }}>Modalidades:</Text>{" "}
                {curso.modalidade}
              </Text>

              {/* Só exibe o botão se o curso possuir um link válido */}
              {curso.link ? (
                <TouchableOpacity
                  style={modalStyles.btnSiteOficial}
                  onPress={() => Linking.openURL(curso.link)}
                >
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
                          local: ev.local || curso.titulo,
                          turma: curso.titulo,
                          autor: `Coordenação de ${curso.titulo}`,
                          descricao:
                            ev.descricao ||
                            `Evento oficial vinculado ao curso de ${curso.titulo}.`,
                          horas_acc: 10,
                        });
                      }}
                    >
                      <Text style={modalStyles.textoBtnDetalhesModal}>
                        + Detalhes
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={modalStyles.textoVazio}>
                  Nenhum evento ou aviso publicado ainda.
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
                  color={CoresInstitucionais.azulPrincipal}
                />
              ) : publicacoes.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled
                  contentContainerStyle={modalStyles.listaPublicacoes}
                >
                  {publicacoes.map((publicacao) => {
                    const descricaoExpandida =
                      publicacoesExpandidas === publicacao.id;

                    const imagem = publicacao.imagem?.caminho_img;

                    return (
                      <View
                        key={publicacao.id}
                        style={[
                          modalStyles.publicacaoCard,
                          { width: larguraCardPublicacao },
                        ]}
                      >
                        {imagem ? (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                              setImagemSelecionada(
                                publicacao.imagem?.caminho_img_original || imagem
                              )
                            }
                          >
                            <Image
                              source={{ uri: imagem }}
                              style={modalStyles.imagemPublicacao}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={modalStyles.imagemPublicacaoVazia}>
                            <CustomIcon
                              name="image"
                              size={30}
                              color="#999"
                            />
                          </View>
                        )}

                        <View style={modalStyles.conteudoPublicacao}>
                          {/* Título */}
                          <Text
                            style={modalStyles.tituloPublicacao}
                          >
                            {publicacao.titulo}
                          </Text>

                          {/* Descrição */}
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
                        <Text style={{ fontSize: 16, color: "#ffffff" }}>
                          👤
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={modalStyles.nomeCoordenacao}>
                          {coord.nome}
                        </Text>
                        <Text style={modalStyles.descricaoCoordenacao}>
                          Coordenação de {curso.titulo}
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 8, gap: 4 }}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${coord.email}`)}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#054ca9",
                            fontWeight: "bold",
                          }}
                        >
                          ✉️ {coord.email}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${coord.telefone}`)}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#054ca9",
                            fontWeight: "bold",
                          }}
                        >
                          📞 {coord.telefone}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={modalStyles.cardCoordenacao}>
                  <View style={modalStyles.topoCoordenacao}>
                    <View style={modalStyles.avatarCoordenacao}>
                      <Text style={{ fontSize: 16, color: "#ffffff" }}>👤</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={modalStyles.nomeCoordenacao}>
                        Coordenação de {curso.titulo}
                      </Text>
                      <Text style={modalStyles.descricaoCoordenacao}>
                        Quer saber mais sobre o curso? Entre em contato com a
                        coordenação acadêmica.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[modalStyles.btnContato, { marginTop: 8 }]}
                    onPress={() =>
                      Linking.openURL(
                        "mailto:coordenacao@estacio.br?subject=Dúvida sobre o curso " +
                          curso.titulo,
                      )
                    }
                  >
                    <Text style={modalStyles.textoBtnContato}>
                      Enviar E-mail
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* MODAL DE VISUALIZAÇÃO DA IMAGEM */}
          <Modal
            visible={!!imagemSelecionada}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImagemSelecionada(null)}
          >
            <View style={modalStyles.overlayImagem}>
              <TouchableOpacity
                style={modalStyles.btnFecharImagem}
                onPress={() => setImagemSelecionada(null)}
              >
                <CustomIcon
                  name="close"
                  size={26}
                  color={CoresInstitucionais.brancoPuro}
                />
              </TouchableOpacity>

              {imagemSelecionada && (
                <Image
                  source={{ uri: imagemSelecionada }}
                  style={modalStyles.imagemOriginal}
                  resizeMode="contain"
                />
              )}
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
}