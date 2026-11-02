import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { appStyles as styles } from "../../styles/mural/mainStyles";
import CustomIcon from "../CustomIcon";
import AvisosGerencia from "./AvisosGerencia"; // 👈 Importa o componente separado

export default function CalendarioAcademico({
  semestre, diasSemana, renderizarDias,
  diaFocado, eventosDoDia, onSelectEvento, carregandoEventos, erroEventos,
  avisosAtivos = [], onReexibirAviso
}) {
  return (
    <View>
      {/* 🔔 Chamada limpa em forma de componente/função */}
      <AvisosGerencia 
        avisosAtivos={avisosAtivos} 
        onReexibirAviso={onReexibirAviso} 
      />

      {/* CALENDÁRIO COMPLETO DO SEMESTRE */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>
          AGENDA ACADÊMICA — PRÓXIMOS 4 MESES
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollCalendario}
        >
          {semestre &&
            semestre.map((mes) => (
              <View key={mes.id} style={styles.calendarioBoxMini}>
                <View style={styles.mesHeaderAzul}>
                  <Text style={styles.mesTitulo}>{mes.nome}</Text>
                </View>
                <View style={styles.calendarioGrid}>
                  {diasSemana &&
                    diasSemana.map((dia, idx) => (
                      <View key={`semana-${idx}`} style={styles.celulaDia}>
                        <Text style={styles.textoDiaSemana}>{dia}</Text>
                      </View>
                    ))}
                  {renderizarDias &&
                    renderizarDias(
                      mes.nome,
                      mes.totalDias,
                      mes.espacosVazios,
                      mes.ano,
                    )}
                </View>
              </View>
            ))}
        </ScrollView>
        <Text style={styles.legendaCalendario}>
          Dias em amarelo possuem eventos acadêmicos
        </Text>
        {carregandoEventos && (
          <Text style={styles.textoMutavel}>Carregando eventos...</Text>
        )}
        {erroEventos && (
          <Text style={[styles.textoMutavel, { color: "#b00020" }]}>
            Não foi possível carregar os eventos: {erroEventos}
          </Text>
        )}
      </View>

      {/* CAIXA DE EVENTOS DO DIA CLICADO */}
      {diaFocado && (
        <View style={styles.areaEventosDoDia}>
          <Text style={styles.tituloDiaFocado}>Eventos de {diaFocado}</Text>
          {eventosDoDia && eventosDoDia.length > 0 ? (
            eventosDoDia.map((evento) => (
              <View key={evento.id} style={styles.cartaoDiaFocado}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.tituloCartaoPequeno}>
                    {evento.titulo}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    📍 {evento.local || "A definir"}  |  🕛 {evento.horasAAC || evento.horas_acc || 0}h ACC
                  </Text>
                </View>
                <TouchableOpacity 
                  style={{ backgroundColor: '#032551', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 }}
                  onPress={() => onSelectEvento(evento)}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>Ver Descrição</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.textoMutavel}>
              Nenhum evento agendado para este dia.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}