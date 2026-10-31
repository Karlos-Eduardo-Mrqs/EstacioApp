import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { CoresInstitucionais } from "../../styles/theme";
import { formatarDataApenas } from "../../utils/dataUtils"; // 👈 Importa o formatador centralizado

export default function CarrosselEventosCursosFavoritos({
  todosOsEventos = [],
  cursosSelecionados = [],
  cursosDisponiveis = [],
  onSelectEvento,
}) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // 1. Cruza os IDs ou títulos salvos com os cursos disponíveis para extrair os nomes reais em texto
  const nomesCursosSelecionados = cursosDisponiveis
    .filter(
      (curso) =>
        cursosSelecionados.includes(curso.id) ||
        cursosSelecionados.includes(String(curso.id)) ||
        cursosSelecionados.includes(curso.titulo) ||
        cursosSelecionados.includes(curso.nome),
    )
    .map((curso) => (curso.titulo || curso.nome || "").toLowerCase());

  // 2. Termos de busca normalizados para comparar com os eventos
  const termosBusca =
    nomesCursosSelecionados.length > 0
      ? nomesCursosSelecionados
      : cursosSelecionados.map((item) => String(item).toLowerCase());

  const eventosFavoritos = todosOsEventos.filter((evento) => {
    // Extrai o nome da turma/curso do evento com segurança (seja string ou objeto)
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

    // Compara se o curso do evento faz parte dos favoritos do usuário
    const match = termosBusca.some(
      (termo) => turmaStr.includes(termo) || termo.includes(turmaStr),
    );

    // Valida se o evento é de hoje em diante
    const dataEventoObj =
      evento.dataEvento instanceof Date
        ? evento.dataEvento
        : new Date(evento.dataEvento || evento.data);
    const dataValida = dataEventoObj >= hoje;

    return match && dataValida;
  });

  // Se não houver eventos favoritos para exibir, oculta o bloco inteiro
  if (eventosFavoritos.length === 0) return null;

  return (
    <View style={{ marginBottom: 24, marginTop: 16 }}>
      {/* ── TÍTULO DA SEÇÃO ── */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: CoresInstitucionais.azulPrincipal,
            textTransform: "uppercase",
          }}
        >
          ⭐ EVENTOS DOS SEUS CURSOS FAVORITOS
        </Text>
      </View>

      {/* ── LINHA DIVISÓRIA ── */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#032551",
          marginBottom: 12,
          marginHorizontal: 16,
        }}
      />

      {/* ── SCROLL HORIZONTAL DE CARTÕES ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 40, gap: 12 }}
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

          // 📅 Formatação correta e segura da data para cada evento do carrossel
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
    </View>
  );
}
