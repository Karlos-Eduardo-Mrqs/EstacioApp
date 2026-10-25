import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { appStyles as styles } from "../../styles/mural/mainStyles";
import CursosCarrossel from "./CarrosselCursos";
import CarrosselEventosCursosFavoritos from "./CarrosselEventosCursosFavoritos";
import CarrosselDestaques from "./CarrosselDestaques";

export default function ListaCarrosseis({
  cursos,
  cursosTecnicos,
  cursosFavoritosIds = [], // Recebe os IDs dos cursos salvos
  listaProximos,
  listaSemana,
  eventosProximoMes,
  onSelectCurso,
  onSelectEvento,
  carregandoCursos,
  erroCursos,
  todosOsEventos = [],
}) {
  
  const renderCartaoCarrossel = (evento) => (
    <View key={evento.id} style={estilosCarrosselEvento.cartao}>
      <Text style={estilosCarrosselEvento.tag}>{evento.tipo}</Text>
      <Text style={estilosCarrosselEvento.titulo} numberOfLines={2}>
        {evento.titulo}
      </Text>
      <Text style={estilosCarrosselEvento.data}>
        📅 {evento.dia} de {evento.mes}
      </Text>
      <Text style={estilosCarrosselEvento.local} numberOfLines={1}>
        📍 {evento.local || "Local a definir"}
      </Text>

      <TouchableOpacity
        style={estilosCarrosselEvento.botaoDetalhes}
        onPress={() => onSelectEvento?.(evento)}
      >
        <Text style={estilosCarrosselEvento.textoBotao}>+ Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>

      {/* ── DEPTH CAROUSEL ORIGINAL (TODOS OS CURSOS) ── */}
      <CursosCarrossel cursos={cursos || []}
        cursosTecnicos={cursosTecnicos || []}
        onSelectCurso={onSelectCurso}
        carregandoCursos={carregandoCursos}
        erroCursos={erroCursos}
      />

      {/* ── CARROSSEL DE EVENTOS DOS CURSOS FAVORITOS ── */}
      <CarrosselEventosCursosFavoritos
        todosOsEventos={todosOsEventos}
        cursosSelecionados={cursosFavoritosIds}
        cursosDisponiveis={cursos} // 👈 Passa os cursos disponíveis para traduzir o ID no nome
        onSelectEvento={onSelectEvento}
      />

      {/* Demais carrosséis de eventos padrão... */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>PRÓXIMOS EVENTOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
          {listaProximos?.length > 0 ? listaProximos.map(renderCartaoCarrossel) : <Text style={styles.textoMutavel}>Nenhum próximo evento encontrado.</Text>}
        </ScrollView>
      </View>

      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>EVENTOS DA SEMANA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
          {listaSemana?.length > 0 ? listaSemana.map(renderCartaoCarrossel) : <Text style={styles.textoMutavel}>Nenhum evento agendado para esta semana.</Text>}
        </ScrollView>
      </View>

      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>EVENTOS PARA O PRÓXIMO MÊS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
          {eventosProximoMes?.length > 0 ? eventosProximoMes.map(renderCartaoCarrossel) : <Text style={styles.textoMutavel}>Nenhum evento para o próximo mês.</Text>}
        </ScrollView>
      </View>

      {/* <CarrosselDestaques /> */}
    </View>
  );
}