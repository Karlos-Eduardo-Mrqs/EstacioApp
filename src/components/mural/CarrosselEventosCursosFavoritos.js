import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";

export default function CarrosselEventosCursosFavoritos({
  todosOsEventos = [],
  cursosSelecionados = [],
  cursosDisponiveis = [], // 👈 Recebe a lista de cursos do banco
  onSelectEvento,
}) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Mapeia os IDs numéricos salvos (ex: 5, 8) para os nomes reais dos cursos (ex: "Administração")
  const nomesCursosSelecionados = cursosDisponiveis
    .filter((curso) => cursosSelecionados.includes(curso.id) || cursosSelecionados.includes(curso.titulo))
    .map((curso) => (curso.titulo || curso.nome).toLowerCase());

  // Se por acaso o array acima estiver vazio, usamos os próprios valores selecionados caso já sejam strings
  const termosBusca = nomesCursosSelecionados.length > 0 
    ? nomesCursosSelecionados 
    : cursosSelecionados.map((item) => String(item).toLowerCase());

  // Filtra os eventos cuja turma corresponde a um dos cursos selecionados
  const eventosFavoritos = todosOsEventos.filter((evento) => {
    if (!evento.turma) return false;
    const turmaStr = String(evento.turma).toLowerCase();

    const match = termosBusca.some(
      (termo) => turmaStr.includes(termo) || termo.includes(turmaStr)
    );

    const dataValida = new Date(evento.dataEvento) >= hoje;
    return match && dataValida;
  });

  // Se não houver eventos correspondentes, ocultamos o carrossel limpidamente
  if (eventosFavoritos.length === 0) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold", color: '#032551' }}>
          ⭐ Eventos dos Seus Cursos Favoritos
        </Text>
        <Text style={{ fontSize: 12, color: "#64748b" }}>
          Avisos e eventos em destaque para as suas áreas de interesse
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilosCarrosselEvento.containerScroll}
      >
        {eventosFavoritos.map((evento, index) => (
          <View key={evento.id || index} style={estilosCarrosselEvento.cartao}>
            <Text style={estilosCarrosselEvento.tag}>{evento.tipo || "Evento"}</Text>
            
            <Text style={estilosCarrosselEvento.titulo} numberOfLines={2}>
              {evento.titulo}
            </Text>
            
            <Text style={estilosCarrosselEvento.data}>
              📅 {evento.dia} de {evento.mes}
            </Text>
            
            <Text style={estilosCarrosselEvento.local} numberOfLines={1}>
              📍 {evento.local || evento.turma}
            </Text>

            <TouchableOpacity
              style={estilosCarrosselEvento.botaoDetalhes}
              onPress={() => onSelectEvento?.(evento)}
            >
              <Text style={estilosCarrosselEvento.textoBotao}>+ Detalhes</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}