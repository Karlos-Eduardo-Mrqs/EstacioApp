import {Linking,Modal,ScrollView,Text,TouchableOpacity,View,} from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon";
import BotaoFechar from "../BotaoFechar";
import ModalVisualizarImagem from "../ModalVisualizarImagemCheia";
import LeituraPopup from "../leituraPopup";
import SectionCoordenacaoCurso from "./secaoCoordenacaoCurso";
import CarrosselPublicacoesCurso from "./CarrosselPublicacoes";
import { useModalCurso } from "../../hooks/useModalCurso";

export default function ModalCurso({ curso, onClose }) {
  const {
    publicacoes,
    avisosCurso,
    coordenadoresCurso,
    carregandoPublicacoes,
    publicacoesExpandidas,
    imagemSelecionada,
    setImagemSelecionada,
    avisoSelecionado,
    setAvisoSelecionado,
    alternarDescricao,
    precisaExpandir,
  } = useModalCurso(curso);

  if (!curso) return null;

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

              <CarrosselPublicacoesCurso
                publicacoes={publicacoes}
                carregandoPublicacoes={carregandoPublicacoes}
                publicacoesExpandidas={publicacoesExpandidas}
                alternarDescricao={alternarDescricao}
                precisaExpandir={precisaExpandir}
                onSelectImagem={setImagemSelecionada}
              />

              <SectionCoordenacaoCurso curso={curso} coordenadores={coordenadoresCurso} />
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