import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { CoresInstitucionais } from "../../styles/theme";
import { formatarDataApenas } from "../../utils/dataUtils";
import ControlesCarrossel from "../ControlesCarrossel";

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
              style={estilosCarrosselEvento.cartao}
            >
              <Text style={estilosCarrosselEvento.tag}>{nomeTurmaCard}</Text>

              <Text style={estilosCarrosselEvento.titulo} numberOfLines={2}>
                {evento.titulo}
              </Text>

              <Text style={estilosCarrosselEvento.data}>
                📅 {dataFormatada || "Data a definir"}
              </Text>

              <Text style={estilosCarrosselEvento.local} numberOfLines={1}>
                📍 {evento.local || evento.palestrante || "A definir"}
              </Text>

              <TouchableOpacity
                style={estilosCarrosselEvento.botaoDetalhes}
                onPress={() => onSelectEvento?.(evento)}
              >
                <Text style={estilosCarrosselEvento.textoBotao}>
                  + Detalhes
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