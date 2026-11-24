import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { appStyles as styles } from "../../styles/mural/mainStyles";
import { formatarDataApenas } from "../../utils/dataUtils";
import CursosCarrossel from "./CarrosselCursos";
import CarrosselEventosCursosFavoritos from "./CarrosselEventosCursosFavoritos";
import CarrosselServicos from "./CarrosselServicos";
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

function SecaoCarrosselEventos({
  titulo,
  eventos = [],
  mensagemVazio,
  renderCartao,
}) {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [larguraConteudo, setLarguraConteudo] = useState(0);
  const [larguraContainer, setLarguraContainer] = useState(0);

  return (
    <View style={styles.blocoSection}>
      <Text style={styles.tituloSecaoBloco}>{titulo}</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
        onLayout={(e) => setLarguraContainer(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setLarguraConteudo(w)}
        contentContainerStyle={estilosCarrosselEvento.containerScroll}
      >
        {eventos.length > 0 ? (
          eventos.map(renderCartao)
        ) : (
          <Text style={styles.textoMutavel}>{mensagemVazio}</Text>
        )}
      </ScrollView>

      {eventos.length > 0 && (
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
      )}
    </View>
  );
}

export default function ListaCarrosseis({
  cursos,
  cursosTecnicos,
  cursosFavoritosIds = [],
  listaProximos,
  listaSemana,
  eventosProximoMes,
  servicos = [],
  onSelectCurso,
  onSelectEvento,
  onSelectServico,
  carregandoCursos,
  erroCursos,
  todosOsEventos = [],
}) {
  const renderCartaoCarrossel = (evento) => {
    const cancelado = estaDesativado(evento);

    let nomeTurma = "Geral";
    if (evento?.turma) {
      nomeTurma =
        typeof evento.turma === "object"
          ? evento.turma.nome || "Geral"
          : evento.turma;
    } else if (evento?.curso) {
      nomeTurma =
        typeof evento.curso === "object"
          ? evento.curso.nome || "Geral"
          : evento.curso;
    }

    const dataFormatada = formatarDataApenas(
      evento.inicio || evento.data || evento.dataEvento,
    );

    return (
      <View
        key={evento.id}
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
            {nomeTurma}
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
          📍 {evento.local || "Local a definir"}
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
  };

  return (
    <View>
      <CursosCarrossel
        cursos={cursos || []}
        cursosTecnicos={cursosTecnicos || []}
        cursosFavoritosIds={cursosFavoritosIds}
        onSelectCurso={onSelectCurso}
        carregandoCursos={carregandoCursos}
        erroCursos={erroCursos}
      />

      <CarrosselEventosCursosFavoritos
        todosOsEventos={todosOsEventos}
        cursosSelecionados={cursosFavoritosIds}
        cursosDisponiveis={cursos}
        onSelectEvento={onSelectEvento}
      />

      <SecaoCarrosselEventos
        titulo="PRÓXIMOS EVENTOS"
        eventos={listaProximos || []}
        mensagemVazio="Nenhum próximo evento encontrado."
        renderCartao={renderCartaoCarrossel}
      />

      <SecaoCarrosselEventos
        titulo="EVENTOS DA SEMANA"
        eventos={listaSemana || []}
        mensagemVazio="Nenhum evento agendado para esta semana."
        renderCartao={renderCartaoCarrossel}
      />

      <SecaoCarrosselEventos
        titulo="EVENTOS PARA O PRÓXIMO MÊS"
        eventos={eventosProximoMes || []}
        mensagemVazio="Nenhum evento para o próximo mês."
        renderCartao={renderCartaoCarrossel}
      />

      <CarrosselServicos
        servicos={servicos || []}
        onSelectServico={onSelectServico}
      />
    </View>
  );
}