import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { appStyles as styles } from "../../styles/mural/mainStyles";

export default function CalendarioAcademico({
  semestre, diasSemana, renderizarDias,
  diaFocado, eventosDoDia, onSelectEvento, carregandoEventos, erroEventos,
  avisosAtivos = [], onReexibirAviso
}) {
  return (
    <View>
      {/* AVISOS DA GERÊNCIA */}
      <View style={styles.blocoSection}>
        <Text style={styles.tituloSecaoBloco}>AVISOS DA GERÊNCIA</Text>
        
        {avisosAtivos && avisosAtivos.length > 0 ? (
          avisosAtivos.map((aviso) => (
            <TouchableOpacity
              key={aviso.id}
              style={{
                backgroundColor: '#FEF9C3',
                borderLeftWidth: 4,
                borderLeftColor: '#FACC15',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onPress={() => onReexibirAviso && onReexibirAviso(aviso)}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#713F12' }} numberOfLines={1}>
                  {aviso.titulo}
                </Text>
                <Text style={{ fontSize: 11, color: '#854D0E', marginTop: 2 }} numberOfLines={2}>
                  {aviso.mensagem}
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#CA8A04' }}>Ver 👆</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.caixaAviso}>
            <Text style={styles.textoMutavel}>
              Sem avisos globais no momento.
            </Text>
          </View>
        )}
      </View>

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
                  <Text style={styles.mesTituloBranco}>{mes.nome}</Text>
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
                  <Text style={{ fontSize: 10, color: "#666" }}>
                    📍 {evento.local || "A definir"} | 🕛 {evento.horas_acc || 0}h Acc
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onSelectEvento(evento)}>
                  <Text style={styles.btnTextoMiniAzul}>Ver Descrição</Text>
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