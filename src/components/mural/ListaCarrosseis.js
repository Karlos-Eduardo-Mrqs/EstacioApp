import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { carrosselEventosStyles as estilosCarrosselEvento } from "../../styles/mural/carrosselEventosStyles";
import { appStyles as styles } from "../../styles/mural/mainStyles";
import Carrossel from "./Carrossel";
import DepthCarousel from "./CarrosselCursos";

export default function ListaCarrosseis({
  cursos,
  cursosTecnicos,
  listaProximos,
  listaSemana,
  eventosProximoMes,
  onSelectCurso,
  onSelectEvento,
}) {
  // Função auxiliar para renderizar cartões em formato de carrossel horizontal
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
        📍 {evento.local}
      </Text>

      <TouchableOpacity
        style={estilosCarrosselEvento.botaoDetalhes}
        onPress={() => onSelectEvento(evento)}
      >
        <Text style={estilosCarrosselEvento.textoBotao}>+ Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {/* CARROSSEL DE CURSOS */}
      {cursos && (
        <DepthCarousel
          cursos={cursos}
          cursosTecnicos={cursosTecnicos || []}
          onSelectCurso={onSelectCurso}
        />
      )}

      {/* CARROSSEL: PRÓXIMOS EVENTOS */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>PRÓXIMOS EVENTOS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilosCarrosselEvento.containerScroll}
        >
          {listaProximos && listaProximos.length > 0 ? (
            listaProximos.map(renderCartaoCarrossel)
          ) : (
            <Text style={styles.textoMutavel}>
              Nenhum próximo evento encontrado.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* CARROSSEL: EVENTOS DA SEMANA */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>EVENTOS DA SEMANA</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilosCarrosselEvento.containerScroll}
        >
          {listaSemana && listaSemana.length > 0 ? (
            listaSemana.map(renderCartaoCarrossel)
          ) : (
            <Text style={styles.textoMutavel}>
              Nenhum evento agendado para esta semana.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* CARROSSEL: EVENTOS PARA O PRÓXIMO MÊS */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>EVENTOS PARA O PRÓXIMO MÊS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilosCarrosselEvento.containerScroll}
        >
          {eventosProximoMes && eventosProximoMes.length > 0 ? (
            eventosProximoMes.map(renderCartaoCarrossel)
          ) : (
            <Text style={styles.textoMutavel}>
              Nenhum evento para o próximo mês.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* CARROSSEL GERAL NO FINAL DA PÁGINA */}
      <Carrossel />
    </View>
  );
}
