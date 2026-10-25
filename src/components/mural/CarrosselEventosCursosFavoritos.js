import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { CoresInstitucionais } from "../../styles/theme";

export default function CarrosselEventosCursosFavoritos({
  todosOsEventos = [],
  cursosSelecionados = [],
  cursosDisponiveis = [],
  onSelectEvento,
}) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const nomesCursosSelecionados = cursosDisponiveis
    .filter((curso) => cursosSelecionados.includes(curso.id) || cursosSelecionados.includes(curso.titulo))
    .map((curso) => (curso.titulo || curso.nome).toLowerCase());

  const termosBusca = nomesCursosSelecionados.length > 0 
    ? nomesCursosSelecionados 
    : cursosSelecionados.map((item) => String(item).toLowerCase());

  const eventosFavoritos = todosOsEventos.filter((evento) => {
    if (!evento.turma) return false;
    const turmaStr = String(evento.turma).toLowerCase();

    const match = termosBusca.some(
      (termo) => turmaStr.includes(termo) || termo.includes(turmaStr)
    );

    const dataValida = new Date(evento.dataEvento) >= hoje;
    return match && dataValida;
  });

  if (eventosFavoritos.length === 0) return null;

  return (
    <View style={{ marginBottom: 24, marginTop: 16 }}>
      {/* ── TÍTULO COM O MESMO PADDING LATERAL DOS DEMAIS ── */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: CoresInstitucionais.azulPrincipal, textTransform: 'uppercase' }}>
          ⭐ EVENTOS DOS SEUS CURSOS FAVORITOS
        </Text>
      </View>

      {/* ── LINHA DIVISÓRIA COM A MESMA MARGEM LATERAL ── */}
      <View 
        style={{ 
          borderTopWidth: 1, 
          borderTopColor: '#032551', 
          marginBottom: 12, 
          marginHorizontal: 16 
        }} 
      />

      {/* ── SCROLL HORIZONTAL COM PADDING INICIAL IDÊNTICO ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 40, gap: 12 }}
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