import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { modalServicosStyles as styles } from "../../styles/mural/modalServicosStyles";
import BotaoFechar from "../BotaoFechar";
import CustomIcon from "../CustomIcon";

function estaDesativado(item) {
  if (!item) return false;
  if (item.status === false) return true;
  if (typeof item.status === "string") {
    const st = item.status.trim().toLowerCase();
    return st === "cancelado" || st === "desativado" || st === "inativo";
  }
  return false;
}

export default function ModalDetalhesServico({ servico, visible, onClose }) {
  if (!servico) return null;

  const servicoDesativado = estaDesativado(servico);

  const abrirEmail = (email) => {
    if (!servicoDesativado && email && email !== "A definir") {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const abrirLink = (url) => {
    if (!servicoDesativado && url) {
      Linking.openURL(url);
    }
  };

  const inicialResponsavel =
    servico.responsavel && servico.responsavel !== "A definir"
      ? servico.responsavel
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "ST";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalFundo} onPress={onClose}>
        <Pressable
          style={[
            styles.modalDetalhes,
            servicoDesativado && { borderColor: "#FECACA", borderWidth: 1.5 },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* TOPO DO MODAL */}
          <View
            style={[
              styles.modalHeaderDetalhes,
              servicoDesativado && { backgroundColor: "#334155" },
            ]}
          >
            <BotaoFechar onPress={onClose} style={styles.fecharModal} />

            <Text style={styles.modalSubtopo}>
              {servico.curso ? servico.curso.toUpperCase() : "SERVIÇO INSTITUCIONAL"}
            </Text>
            <Text
              style={[
                styles.modalTituloPrincipal,
                servicoDesativado && { textDecorationLine: "line-through" },
              ]}
            >
              {servico.nome}
            </Text>

            {servicoDesativado && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#FEE2E2",
                  borderWidth: 1,
                  borderColor: "#FECACA",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 6,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: "#DC2626",
                  }}
                >
                  SERVIÇO DESATIVADO
                </Text>
              </View>
            )}

            <View style={styles.faixaAmarelaTopo} />
          </View>

          {/* CORPO DO MODAL */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {servicoDesativado && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#FEF2F2",
                  borderWidth: 1,
                  borderColor: "#FECACA",
                  borderLeftWidth: 4,
                  borderLeftColor: "#DC2626",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 14,
                }}
              >
                <CustomIcon
                  name="close-circle-outline"
                  size={20}
                  color="#DC2626"
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    fontWeight: "600",
                    color: "#991B1B",
                  }}
                >
                  Este serviço está desativado no momento. Atendimento, links e
                  contato direto estão suspensos.
                </Text>
              </View>
            )}

            {/* APRESENTAÇÃO */}
            <Text style={styles.secaoTitulo}>APRESENTAÇÃO</Text>
            <Text style={styles.secaoTexto}>
              {servico.descricao || "Sem descrição informada."}
            </Text>

            {/* CURSO / CATEGORIA */}
            <View style={styles.infoLinha}>
              <Text style={styles.infoLabel}>📌 Curso / Categoria:</Text>
              <Text style={styles.infoValor}>
                {servico.curso || "Geral / Todos"}
              </Text>
            </View>

            {/* 🕒 HIGHLIGHT: CARD DE ATENDIMENTO / HORÁRIOS */}
            {servico.dias ? (
              <View style={styles.cardHorario}>
                <View style={styles.cardHorarioIcone}>
                  <CustomIcon name="time-outline" size={22} color="#1D4ED8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardHorarioTitulo}>HORÁRIO DE ATENDIMENTO</Text>
                  <Text style={styles.cardHorarioTexto}>{servico.dias}</Text>
                </View>
              </View>
            ) : null}

            {/* ⚠️ HIGHLIGHT: CARD DE AVISOS E INFORMAÇÕES */}
            <View style={styles.cardAviso}>
              <View style={styles.cardAvisoHeader}>
                <CustomIcon
                  name="information-circle-outline"
                  size={20}
                  color="#B45309"
                />
                <Text style={styles.cardAvisoTitulo}>AVISOS E INFORMAÇÕES</Text>
              </View>
              <Text style={styles.cardAvisoTexto}>
                {servico.aviso || "Nenhum aviso publicado no momento."}
              </Text>
            </View>

            {/* 🔗 LINKS ÚTEIS */}
            {servico.linksUteis ? (
              <View
                style={[
                  styles.cardAviso,
                  {
                    backgroundColor: "#ECFDF5",
                    borderColor: "#A7F3D0",
                    borderLeftColor: "#059669",
                    borderLeftWidth: 5,
                    marginTop: 15,
                  },
                ]}
              >
                <View style={styles.cardAvisoHeader}>
                  <CustomIcon name="link-outline" size={20} color="#059669" />
                  <Text style={[styles.cardAvisoTitulo, { color: "#065F46" }]}>
                    LINKS ÚTEIS
                  </Text>
                </View>

                {servico.linksUteis.split("\n").map((linha, idx) => {
                  if (!linha.trim()) return null;
                  const partes = linha.split(":");
                  const nomeLink = partes[0]?.trim() || "Acessar Link";
                  const urlLink = partes.slice(1).join(":").replace(";", "").trim();

                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={servicoDesativado}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 8,
                        borderWidth: 1,
                        borderColor: "#A7F3D0",
                        opacity: servicoDesativado ? 0.5 : 1,
                      }}
                      onPress={() => abrirLink(urlLink)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.cardHorarioIcone,
                          {
                            backgroundColor: "#D1FAE5",
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 12,
                          },
                        ]}
                      >
                        <CustomIcon
                          name="open-outline"
                          size={18}
                          color="#059669"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "#065F46",
                          }}
                        >
                          {nomeLink}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#047857",
                            marginTop: 1,
                          }}
                        >
                          {servicoDesativado
                            ? "Link indisponível (serviço desativado)"
                            : "Clique para acessar a página externa"}
                        </Text>
                      </View>

                      <CustomIcon
                        name="chevron-forward"
                        size={16}
                        color="#059669"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}

            {/* FALE COM A COORDENAÇÃO */}
            <Text style={[styles.secaoTitulo, { marginTop: 18 }]}>
              FALE COM A COORDENAÇÃO
            </Text>

            <View style={styles.coordenacaoBox}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniTexto}>{inicialResponsavel}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.coordNome}>
                  {servico.responsavel || "Coordenação"}
                </Text>
                <Text style={styles.coordSub}>
                  {servico.cargo || "Coordenador(a) responsável"} (
                  {servico.email})
                </Text>
              </View>
            </View>

            {/* ENVIAR EMAIL */}
            {!servicoDesativado &&
            servico.email &&
            servico.email !== "A definir" ? (
              <TouchableOpacity
                style={styles.botaoEnviarEmail}
                onPress={() => abrirEmail(servico.email)}
              >
                <Text style={styles.botaoEnviarEmailTexto}>Enviar E-mail </Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}