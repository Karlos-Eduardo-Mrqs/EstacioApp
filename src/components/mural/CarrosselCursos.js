import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselCursosStyles as styles } from "../../styles/mural/carrosselCursosStyles";
import CustomIcon from "../CustomIcon"; // 👈 Importa o CustomIcon para desenhar a estrela

export default function CursosCarrossel({
  cursos = [],
  cursosTecnicos = [],
  cursosFavoritosIds = [], // 👈 Recebe a lista de cursos favoritos/selecionados
  onSelectCurso,
  carregandoCursos = false,
  erroCursos = null,
}) {
  const [tipoAtivo, setTipoAtivo] = useState("destaque");

  const listaAtual = tipoAtivo === "destaque" ? cursos : cursosTecnicos;

  return (
    <View style={styles.container}>
      <View style={styles.headerBotoes}>
        <TouchableOpacity
          style={[
            styles.botaoTab,
            tipoAtivo === "destaque" && styles.botaoTabAtivo,
          ]}
          onPress={() => setTipoAtivo("destaque")}
        >
          <Text
            style={[
              styles.textoTab,
              tipoAtivo === "destaque" && styles.textoTabAtivo,
            ]}
          >
            Cursos em Destaque
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoTab,
            tipoAtivo === "tecnico" && styles.botaoTabAtivo,
          ]}
          onPress={() => setTipoAtivo("tecnico")}
        >
          <Text
            style={[
              styles.textoTab,
              tipoAtivo === "tecnico" && styles.textoTabAtivo,
            ]}
          >
            Cursos Técnicos
          </Text>
        </TouchableOpacity>
      </View>

      {carregandoCursos ? (
        <Text style={styles.cardDescription}>Carregando cursos...</Text>
      ) : erroCursos ? (
        <Text style={styles.cardDescription}>
          Não foi possível carregar os cursos: {erroCursos}
        </Text>
      ) : listaAtual.length === 0 ? (
        <Text style={styles.cardDescription}>
          Nenhum curso cadastrado nesta categoria.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {listaAtual.map((curso, index) => {
            // 🛡️ Verifica se o curso atual está na lista de favoritos do usuário (por ID ou nome/título)
            const isFavorito =
              cursosFavoritosIds.includes(curso.id) ||
              cursosFavoritosIds.includes(curso.titulo) ||
              cursosFavoritosIds.includes(curso.nome);

            return (
              <TouchableOpacity
                key={curso.id}
                style={styles.depthCard}
                activeOpacity={0.9}
                onPress={() => onSelectCurso?.(curso)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>#{index + 1}</Text>
                  </View>

                  {/* ⭐ Exibe a estrela se o curso estiver entre os favoritos do usuário */}
                  {isFavorito && (
                    <CustomIcon
                      name="star-outline"
                      size={18}
                      color="#F59E0B"
                      style={{ marginRight: 4 }}
                    />
                  )}
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {curso.titulo}
                </Text>

                <Text style={styles.cardDescription} numberOfLines={3}>
                  {curso.descricao}
                </Text>

                <View style={styles.footerCard}>
                  <Text style={styles.cardModalidade} numberOfLines={1}>
                    📌 {curso.modalidade}
                  </Text>

                  <Text style={styles.verMais}>+ Detalhes</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
