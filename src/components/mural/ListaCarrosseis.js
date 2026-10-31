import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { appStyles as styles } from "../../styles/mural/mainStyles";
import CursosCarrossel from "./CarrosselCursos";
import CarrosselEventosCursosFavoritos from "./CarrosselEventosCursosFavoritos";
import CarrosselDestaques from "./CarrosselDestaques";
import { formatarDataApenas } from "../../utils/dataUtils"; // 👈 Importa o formatador centralizado

export default function ListaCarrosseis({
  cursos,
  cursosTecnicos,
  cursosFavoritosIds = [],
  listaProximos,
  listaSemana,
  eventosProximoMes,
  onSelectCurso,
  onSelectEvento,
  carregandoCursos,
  erroCursos,
  todosOsEventos = [],
}) {
  
  const renderCartaoCarrossel = (evento) => {
    // 🛡️ Tratamento seguro para extrair o nome do curso/turma (evita objetos)
    let nomeTurma = "Geral";
    if (evento?.turma) {
      nomeTurma = typeof evento.turma === 'object' ? (evento.turma.nome || "Geral") : evento.turma;
    } else if (evento?.curso) {
      nomeTurma = typeof evento.curso === 'object' ? (evento.curso.nome || "Geral") : evento.curso;
    }

    // 📅 Formata a data de forma limpa usando a função utilitária centralizada
    const dataFormatada = formatarDataApenas(evento.inicio || evento.data || evento.dataEvento);

    return (
      <View key={evento.id} style={estilosCarrosselEvento.cartao}>
        <Text style={estilosCarrosselEvento.tag} numberOfLines={1}>{nomeTurma}</Text>
        
        <Text style={estilosCarrosselEvento.titulo} numberOfLines={2}>
          {evento.titulo}
        </Text>
        
        <Text style={estilosCarrosselEvento.data}>
          📅 {dataFormatada || "Data a definir"}
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
  };

  return (
    <View>
      {/* ── CARROSSEL DOS CURSOS  (TODOS OS CURSOS) ── */}
      <CursosCarrossel 
        cursos={cursos || []}
        cursosTecnicos={cursosTecnicos || []}
        cursosFavoritosIds={cursosFavoritosIds} // 👈 Garante o repasse da lista de favoritos
        onSelectCurso={onSelectCurso}
        carregandoCursos={carregandoCursos}
        erroCursos={erroCursos}
      />

      {/* ── CARROSSEL DE EVENTOS DOS CURSOS FAVORITOS ── */}
      <CarrosselEventosCursosFavoritos
        todosOsEventos={todosOsEventos}
        cursosSelecionados={cursosFavoritosIds}
        cursosDisponiveis={cursos}
        onSelectEvento={onSelectEvento}
      />

      {/* Próximos Eventos */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>PRÓXIMOS EVENTOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
          {listaProximos?.length > 0 ? listaProximos.map(renderCartaoCarrossel) : <Text style={styles.textoMutavel}>Nenhum próximo evento encontrado.</Text>}
        </ScrollView>
      </View>

      {/* Eventos da Semana */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>EVENTOS DA SEMANA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
          {listaSemana?.length > 0 ? listaSemana.map(renderCartaoCarrossel) : <Text style={styles.textoMutavel}>Nenhum evento agendado para esta semana.</Text>}
        </ScrollView>
      </View>

      {/* Eventos para o Próximo Mês */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>EVENTOS PARA O PRÓXIMO MÊS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
          {eventosProximoMes?.length > 0 ? eventosProximoMes.map(renderCartaoCarrossel) : <Text style={styles.textoMutavel}>Nenhum evento para o próximo mês.</Text>}
        </ScrollView>
      </View>
    </View>
  );
}