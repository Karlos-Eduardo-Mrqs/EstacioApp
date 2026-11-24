import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { CoresInstitucionais } from "../../styles/theme";
import { formatarDataApenas } from "../../utils/dataUtils";
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

export default function CarrosselEventosCursosFavoritos({
  todosOsEventos = [],
  cursosSelecionados = [],
  cursosDisponiveis = [],
  onSelectEvento,
}) {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [larguraConteudo, setLarguraConteudo] = useState(0);
  const [larguraContainer, setLarguraContainer] = useState(0);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const nomesCursosSelecionados = cursosDisponiveis
    .filter(
      (curso) =>
        cursosSelecionados.includes(curso.id) ||
        cursosSelecionados.includes(String(curso.id)) ||
        cursosSelecionados.includes(curso.titulo) ||
        cursosSelecionados.includes(curso.nome),
    )
    .map((curso) => (curso.titulo || curso.nome || "").toLowerCase());

  const termosBusca =
    nomesCursosSelecionados.length > 0
      ? nomesCursosSelecionados
      : cursosSelecionados.map((item) => String(item).toLowerCase());

  const eventosFavoritos = todosOsEventos.filter((evento) => {
    let nomeTurmaEvento = "";
    if (evento?.turma) {
      nomeTurmaEvento =
        typeof evento.turma === "object"
          ? evento.turma.nome || ""
          : String(evento.turma);
    } else if (evento?.curso) {
      nomeTurmaEvento =
        typeof evento.curso === "object"
          ? evento.curso.nome || ""
          : String(evento.curso);
    }

    if (!nomeTurmaEvento) return false;
    const turmaStr = nomeTurmaEvento.toLowerCase();

    const match = termosBusca.some(
      (termo) => turmaStr.includes(termo) || termo.includes(turmaStr),
    );

    const dataEventoObj =
      evento.dataEvento instanceof Date
        ? evento.dataEvento
        : new Date(evento.dataEvento || evento.data);
    const dataValida = dataEventoObj >= hoje;

    return match && dataValida;
  });

  if (eventosFavoritos.length === 0) return null;

  return (
    <View style={estilosCarrosselEvento.secaoFavoritosContainer}>
      <View style={{ marginBottom: 8 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: CoresInstitucionais.azulPrincipal,
            textTransform: "uppercase",
          }}
        >
          ⭐ EVENTOS DOS SEUS CURSOS FAVORITOS
        </Text>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#032551",
          marginBottom: 14,
        }}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
        onLayout={(e) => setLarguraContainer(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setLarguraConteudo(w)}
        contentContainerStyle={estilosCarrosselEvento.containerScroll}
      >
        {eventosFavoritos.map((evento, index) => {
          const cancelado = estaDesativado(evento);

          let nomeTurmaCard = "Geral";
          if (evento?.turma) {
            nomeTurmaCard =
              typeof evento.turma === "object"
                ? evento.turma.nome || "Geral"
                : evento.turma;
          } else if (evento?.curso) {
            nomeTurmaCard =
              typeof evento.curso === "object"
                ? evento.curso.nome || "Geral"
                : evento.curso;
          }

          const dataFormatada = formatarDataApenas(
            evento.inicio || evento.data || evento.dataEvento,
          );

          return (
            <View
              key={evento.id || index}
              style={[
                estilosCarrosselEvento.cartao,
                cancelado && {
                  backgroundColor: "#F8FAFC",
                  borderColor: "#FECACA",
                  borderWidth: 1,
                  opacity: 0.78,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text
                  style={[
                    estilosCarrosselEvento.tag,
                    cancelado && {
                      backgroundColor: "#E2E8F0",
                      color: "#475569",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {nomeTurmaCard}
                </Text>

                {cancelado && (
                  <View
                    style={{
                      backgroundColor: "#FEE2E2",
                      borderWidth: 1,
                      borderColor: "#FECACA",
                      paddingHorizontal: 7,
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
                      CANCELADO
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  estilosCarrosselEvento.titulo,
                  cancelado && {
                    color: "#64748B",
                    textDecorationLine: "line-through",
                  },
                ]}
                numberOfLines={2}
              >
                {evento.titulo}
              </Text>

              <Text
                style={[
                  estilosCarrosselEvento.data,
                  cancelado && { color: "#94A3B8" },
                ]}
              >
                📅 {dataFormatada || "Data a definir"}
              </Text>

              <Text
                style={[
                  estilosCarrosselEvento.local,
                  cancelado && { color: "#94A3B8" },
                ]}
                numberOfLines={1}
              >
                📍 {evento.local || evento.palestrante || "A definir"}
              </Text>

              <TouchableOpacity
                style={[
                  estilosCarrosselEvento.botaoDetalhes,
                  cancelado && { backgroundColor: "#94A3B8" },
                ]}
                onPress={() => onSelectEvento?.(evento)}
              >
                <Text style={estilosCarrosselEvento.textoBotao}>
                  {cancelado ? "Cancelado" : "+ Detalhes"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <ControlesCarrossel
          scrollRef={scrollRef}
          scrollX={scrollX}
          larguraConteudo={larguraConteudo}
          larguraContainer={larguraContainer}
          passoScroll={270}
        />
      </View>
    </View>
  );
}