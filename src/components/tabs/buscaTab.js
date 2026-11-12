import { FlatList, ImageBackground, Text, TextInput, TouchableOpacity, View } from "react-native";
import DetalhesBusca from "../../components/EventoDetalhe";
import { useBuscaEventos } from "../../hooks/useBuscaTab";
import { buscaTabstyles as styles } from "../../styles/detalhesStyles";
import CustomIcon from "../CustomIcon";

export default function BuscaTab({ eventosLista }) {
  const {
    pesquisa,
    setPesquisa,
    eventoModal,
    setEventoModal,
    eventosFiltrados,imagemPadraoUrl
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
        renderItem={({ item }) => {
          const urlCapaCard = 
            typeof item?.imagem === 'object' ? item.imagem?.caminho_img : item?.imagem;

          // Usa a capa do item ou a URL padrão vinda do banco
          const urlFinal = urlCapaCard || imagemPadraoUrl;
          const imagemFonte = urlFinal ? { uri: urlFinal } : null;
            
          let nomeTurma = "Estácio";
          if (item?.turma) {
            nomeTurma = typeof item.turma === 'object' ? (item.turma.nome || "Estácio") : item.turma;
          } else if (item?.curso) {
            nomeTurma = typeof item.curso === 'object' ? (item.curso.nome || "Estácio") : item.curso;
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
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Nenhum evento encontrado.</Text>
          </View>
        }
      />

      {eventoModal && (
        <DetalhesBusca
          evento={eventoModal}
          imagemPadraoUrl={imagemPadraoUrl} // 👈 Passa a URL padrão para o modal
          onClose={() => setEventoModal(null)}
        />
      )}
    </View>
  );
}