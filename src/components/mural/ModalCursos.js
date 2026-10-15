import {
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";

export default function ModalCurso({ curso, onClose, onSelectEvento }) {
  if (!curso) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
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
              <Text style={modalStyles.textoFechar}>X</Text>
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

              {/* Botão de + Informações (Link Oficial) */}
              <TouchableOpacity
                style={modalStyles.btnSiteOficial}
                onPress={() => Linking.openURL(curso.link)}
              >
                <Text style={modalStyles.textoBtnSite}>
                  + Informações (Site Oficial)
                </Text>
              </TouchableOpacity>
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
                    style={[modalStyles.btnContato, { marginTop: 10 }]}
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
        </View>
      </View>
    </Modal>
  );
}
