import { Linking, Modal, ScrollView, Text, TouchableOpacity, View, useWindowDimensions, Platform } from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon"; 
import { CoresInstitucionais } from "../../styles/theme";

export default function ModalCurso({ curso, onClose, onSelectEvento }) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

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
                {curso.descricao || "Nenhuma descrição detalhada informada para este curso até o momento. Consulte o site oficial para mais informações sobre a matriz curricular e ementa."}
              </Text>

              {/* Informações de Tipo e Modalidade com Design Melhorado */}
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

              {/* Botão do Site Oficial */}
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

            {/* BLOCO 3: FALE COM A COORDENAÇÃO */}
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
                    style={[modalStyles.btnContato, { marginTop: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }]}
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
        </View>
      </View>
    </Modal>
  );
}