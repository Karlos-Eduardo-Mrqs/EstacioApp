import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CoresInstitucionais } from "../../styles/theme";
import ModalDetalhesServico from "./ModalServicos";
import { carrosselServicosStyles as styles } from "../../styles/mural/carrosselServicosStyles";
import ControlesCarrossel from "../ControlesCarrossel";

function estaDesativado(item) {
  if (!item) return false;
  if (item.status === false) return true;
  if (typeof item.status === "string") {
    const st = item.status.trim().toLowerCase();
    return st === "cancelado" || st === "desativado" || st === "inativo";
  }
  return false;
}

export default function CarrosselServicos({ servicos = [], onSelectServico }) {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [larguraConteudo, setLarguraConteudo] = useState(0);
  const [larguraContainer, setLarguraContainer] = useState(0);

  if (!servicos || servicos.length === 0) return null;

  const handlePressServico = (item) => {
    setServicoSelecionado(item);
    if (onSelectServico) {
      onSelectServico(item);
    }
  };

  return (
    <View style={styles.secaoContainer}>
      <View style={{ marginBottom: 8, flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            color: CoresInstitucionais.azulPrincipal || "#0A2540",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          🏢 SERVIÇOS INSTITUCIONAIS
        </Text>
      </View>

      <View
        style={{
          height: 2,
          backgroundColor: "#032551",
          marginBottom: 16,
          borderRadius: 2,
          opacity: 0.85,
        }}
      />

      <View style={styles.carrosselWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          scrollEventThrottle={16}
          onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
          onLayout={(e) => setLarguraContainer(e.nativeEvent.layout.width)}
          onContentSizeChange={(w) => setLarguraConteudo(w)}
          contentContainerStyle={styles.listaServicos}
        >
          {servicos.map((item, index) => {
            const desativado = estaDesativado(item);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.cardCarrosselModerno,
                  desativado && {
                    backgroundColor: "#F8FAFC",
                    borderColor: "#FECACA",
                    opacity: 0.78,
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => handlePressServico(item)}
              >
                <View
                  style={[
                    styles.cardHeaderTop,
                    desativado && {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badgeNumero,
                      desativado && { backgroundColor: "#E2E8F0" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cardNumero,
                        desativado && { color: "#64748B" },
                      ]}
                    >
                      #{index + 1}
                    </Text>
                  </View>

                  {desativado && (
                    <View
                      style={{
                        backgroundColor: "#FEE2E2",
                        borderWidth: 1,
                        borderColor: "#FECACA",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "800",
                          color: "#DC2626",
                        }}
                      >
                        DESATIVADO
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardBody}>
                  <Text
                    style={[
                      styles.cardTitulo,
                      desativado && {
                        color: "#64748B",
                        textDecorationLine: "line-through",
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {item.nome}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescricao,
                      desativado && { color: "#94A3B8" },
                    ]}
                    numberOfLines={2}
                  >
                    {desativado
                      ? "Serviço desativado no momento."
                      : item.descricao ||
                        "Conheça este serviço institucional da Estácio."}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.tagContainer,
                      desativado && { backgroundColor: "#E2E8F0" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagTexto,
                        desativado && { color: "#475569" },
                      ]}
                      numberOfLines={1}
                    >
                      📌 {item.curso || "Geral"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.botaoDetalhesPequeno,
                      desativado && { backgroundColor: "#E2E8F0" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.botaoDetalhesText,
                        desativado && { color: "#64748B" },
                      ]}
                    >
                      {desativado ? "Desativado" : "Detalhes →"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <ControlesCarrossel
            scrollRef={scrollRef}
            scrollX={scrollX}
            larguraConteudo={larguraConteudo}
            larguraContainer={larguraContainer}
            passoScroll={280}
          />
        </View>
      </View>

      <ModalDetalhesServico
        servico={servicoSelecionado}
        visible={servicoSelecionado !== null}
        onClose={() => setServicoSelecionado(null)}
      />
    </View>
  );
}