import { FlatList, ImageBackground, Text, TextInput, TouchableOpacity, View } from "react-native";
import DetalhesBusca from "../../components/EventoDetalhe";
import { useBuscaEventos } from "../../hooks/useBuscaTab";
import { buscaTabstyles as styles } from "../../styles/detalhesStyles";
import CustomIcon from "../CustomIcon";

const imagemExemploPadrao = require("../../../assets/image.png");

export default function BuscaTab({ eventosLista }) {
  const {
    pesquisa,
    setPesquisa,
    eventoModal,
    setEventoModal,
    eventosFiltrados,
  } = useBuscaEventos(eventosLista);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <CustomIcon name="search" size={16} color="#8e8e8e" />
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
        renderItem={({ item }) => {
          const imagemFonte = item?.imagem
            ? { uri: item.imagem }
            : imagemExemploPadrao;
          const nomeTurma = item?.turma || item?.curso || "Estácio";

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
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Nenhum evento encontrado.</Text>
          </View>
        }
      />

      {eventoModal && (
        <DetalhesBusca
          evento={eventoModal}
          onClose={() => setEventoModal(null)}
        />
      )}
    </View>
  );
}