import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CoresInstitucionais } from "../../styles/theme";
import ModalDetalhesServico from "./ModalServicos";
import { carrosselServicosStyles as styles } from "../../styles/mural/carrosselServicosStyles";
import ControlesCarrossel from "../ControlesCarrossel";

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
          {servicos.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.cardCarrosselModerno}
              activeOpacity={0.85}
              onPress={() => handlePressServico(item)}
            >
              <View style={styles.cardHeaderTop}>
                <View style={styles.badgeNumero}>
                  <Text style={styles.cardNumero}>#{index + 1}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitulo} numberOfLines={2}>
                  {item.nome}
                </Text>
                <Text style={styles.cardDescricao} numberOfLines={2}>
                  {item.descricao || "Conheça este serviço institucional da Estácio."}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagTexto} numberOfLines={1}>
                    📌 {item.curso || "Geral"}
                  </Text>
                </View>

                <View style={styles.botaoDetalhesPequeno}>
                  <Text style={styles.botaoDetalhesText}>Detalhes →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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