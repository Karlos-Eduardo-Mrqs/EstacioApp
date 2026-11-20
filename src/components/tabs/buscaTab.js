import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DetalhesBusca from "../../components/EventoDetalhe";
import { useBuscaEventos } from "../../hooks/useBuscaTab";
import { buscaTabstyles as styles } from "../../styles/detalhesStyles";
import CustomIcon from "../CustomIcon";

function AnimacaoRolagemRodape({ visivel, carregando }) {
  const pulseAnim = useRef(new Animated.Value(0.45)).current;
  const translateAnim = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    if (!visivel) return;

    translateAnim.setValue(6);
    Animated.timing(translateAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.45,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [visivel, pulseAnim, translateAnim]);

  if (!visivel) return null;

  return (
    <Animated.View
      style={{
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        opacity: pulseAnim,
        transform: [{ translateY: translateAnim }],
      }}
    >
      <ActivityIndicator size="small" color="#173EA5" />
      <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "600" }}>
        {carregando ? "Carregando mais eventos..." : "Role para ver mais eventos"}
      </Text>
    </Animated.View>
  );
}

export default function BuscaTab({ eventosLista }) {
  const {
    pesquisa,
    setPesquisa,
    eventoModal,
    setEventoModal,
    eventosFiltrados,
    temMaisEventos,
    carregandoMais,
    carregarMaisEventos,
    imagemPadraoUrl,
  } = useBuscaEventos(eventosLista);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <CustomIcon name="search-outline" size={16} color="#8e8e8e" />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar eventos, cursos..."
            placeholderTextColor="#8e8e8e"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
          {pesquisa.length > 0 && (
            <TouchableOpacity onPress={() => setPesquisa("")}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={eventosFiltrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        numColumns={3}
        initialNumToRender={21}
        maxToRenderPerBatch={21}
        windowSize={5}
        onEndReached={carregarMaisEventos}
        onEndReachedThreshold={0.25}
        renderItem={({ item }) => {
          const urlCapaCard =
            typeof item?.imagem === "object" ? item.imagem?.caminho_img : item?.imagem;

          const urlFinal = urlCapaCard || imagemPadraoUrl;
          const imagemFonte = urlFinal ? { uri: urlFinal } : null;

          let nomeTurma = "Estácio";
          if (item?.turma) {
            nomeTurma = typeof item.turma === "object" ? item.turma.nome || "Estácio" : item.turma;
          } else if (item?.curso) {
            nomeTurma = typeof item.curso === "object" ? item.curso.nome || "Estácio" : item.curso;
          }

          return (
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => setEventoModal(item)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={imagemFonte}
                style={styles.cardImageBackground}
                resizeMode="cover"
              >
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTag} numberOfLines={1}>
                    {nomeTurma}
                  </Text>
                  <Text style={styles.cardTitle} numberOfLines={3}>
                    {item.titulo}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <AnimacaoRolagemRodape
            visivel={temMaisEventos || carregandoMais}
            carregando={carregandoMais}
          />
        }
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Nenhum evento encontrado.</Text>
          </View>
        }
      />

      {eventoModal && (
        <DetalhesBusca
          evento={eventoModal}
          imagemPadraoUrl={imagemPadraoUrl}
          onClose={() => setEventoModal(null)}
        />
      )}
    </View>
  );
}