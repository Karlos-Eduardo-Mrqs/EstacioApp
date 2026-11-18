// src/components/mural/ModalCursos.js
import { useState, useEffect } from "react";
import { Linking, Modal, ScrollView, Text, TouchableOpacity, View, useWindowDimensions, Platform, Image, ActivityIndicator } from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon"; 
import BotaoFechar from "../BotaoFechar";
import ModalVisualizarImagem from "../ModalVisualizarImagemCheia";
import { buscarPublicacoesDoCursoSimples } from "../../services/publicacaoServices";
import { supabase } from "../../../lib/supabase"; // 👈 Importado para buscar os avisos do curso
import { obterAspectRatioNumerico } from "../../constants/proporcoesConstantes";

export default function ModalCurso({ curso, onClose, onSelectEvento }) {
  const { width } = useWindowDimensions();
  const larguraCardPublicacao = width < 600 ? 260 : 300;

  // Estados locais para gerenciar publicações, avisos e zoom de imagem
  const [publicacoes, setPublicacoes] = useState([]);
  const [avisosCurso, setAvisosCurso] = useState([]); // 👈 Novo estado para os avisos do curso
  const [carregandoPublicacoes, setCarregandoPublicacoes] = useState(false);
  const [publicacoesExpandidas, setPublicacoesExpandidas] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [avisoSelecionado, setAvisoSelecionado] = useState(null); // 👈 Estado para abrir o pop-up de leitura do aviso

  useEffect(() => {
    if (curso?.id) {
      carregarDadosDoCurso(curso.id);
    } else {
      setPublicacoes([]);
      setAvisosCurso([]);
    }
  }, [curso]);

  async function carregarDadosDoCurso(cursoId) {
    try {
      setCarregandoPublicacoes(true);
      
      // 1. Busca publicações e avisos em paralelo para máxima eficiência
      const [dadosPubs, resAvisos] = await Promise.all([
        buscarPublicacoesDoCursoSimples(cursoId),
        supabase
          .from('aviso')
          .select('*')
          .or(`curso_id.eq.${cursoId},curso_id.is.null`)
          .gt('expira_em', new Date().toISOString())
          .order('created_at', { ascending: false })
      ]);

      setPublicacoes(dadosPubs || []);
      setAvisosCurso(resAvisos.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados do curso:", err);
      setPublicacoes([]);
      setAvisosCurso([]);
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
          
          {/* ⚠️ BLOCO DE AVISOS ATIVOS DO CURSO (Clicável para abrir em Pop-up) */}
            {avisosCurso.length > 0 && (
              <View style={[modalStyles.blocoSecao, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 15 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <CustomIcon name="information-circle-outline" size={20} color="#B45309" />
                  <Text style={[modalStyles.tituloBlocoSecao, { color: '#B45309', marginBottom: 0 }]}>
                    AVISOS E COMUNICADOS RECENTES
                  </Text>
                </View>
                <View style={[modalStyles.linhaAmarela, { backgroundColor: '#F59E0B', marginBottom: 10 }]} />
                
                {avisosCurso.map((aviso, idx) => (
                  <TouchableOpacity
                    key={aviso.id || idx}
                    style={{
                      marginBottom: idx < avisosCurso.length - 1 ? 12 : 0,
                      paddingBottom: idx < avisosCurso.length - 1 ? 12 : 0,
                      borderBottomWidth: idx < avisosCurso.length - 1 ? 1 : 0,
                      borderBottomColor: '#FEF3C7',
                    }}
                    onPress={() => setAvisoSelecionado(aviso)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontWeight: '700', fontSize: 13.5, color: '#92400E', marginBottom: 3 }}>
                          {aviso.titulo}
                        </Text>
                        <Text style={{ fontSize: 12.5, color: '#78350F', lineHeight: 18 }} numberOfLines={2}>
                          {aviso.mensagem}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#B45309' }}>Ler 👆</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

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
          
          {/* Modal de imagem em tela cheia */}
          <ModalVisualizarImagem
            visible={!!imagemSelecionada}
            imageUrl={imagemSelecionada}
            onClose={() => setImagemSelecionada(null)}
          />

          {/* 🔍 POP-UP DE LEITURA DO AVISO SELECIONADO */}
          <Modal
            visible={!!avisoSelecionado}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setAvisoSelecionado(null)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <View style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 450, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', pb: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#032551', flex: 1, marginRight: 10 }}>
                    📢 {avisoSelecionado?.titulo}
                  </Text>
                  <TouchableOpacity onPress={() => setAvisoSelecionado(null)}>
                    <CustomIcon name="close" size={22} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 250, marginBottom: 16 }} showsVerticalScrollIndicator={false}>
                  <Text style={{ fontSize: 14, color: '#334155', lineHeight: 22 }}>
                    {avisoSelecionado?.mensagem}
                  </Text>
                </ScrollView>

                <Text style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16, fontStyle: 'italic' }}>
                  Expira em: {avisoSelecionado?.expira_em ? new Date(avisoSelecionado.expira_em).toLocaleString() : ''}
                </Text>

                <TouchableOpacity
                  style={{ backgroundColor: '#032551', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                  onPress={() => setAvisoSelecionado(null)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Entendido</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>
      </View>
    </Modal>
  );
}